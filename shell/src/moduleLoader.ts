// Module Federation Loader with caching, retry logic, and error handling

interface ModuleCache {
  [key: string]: {
    module: any;
    timestamp: number;
    error?: Error;
  };
}

interface LoadModuleOptions {
  retries?: number;
  retryDelay?: number;
  cacheTimeout?: number;
  fallback?: any;
}

class ModuleLoader {
  private cache: ModuleCache = {};
  private readonly defaultOptions: LoadModuleOptions = {
    retries: 3,
    retryDelay: 1000,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
  };

  async loadModule(
    moduleName: string, 
    moduleE: any,
    options: LoadModuleOptions = {}
  ): Promise<any> {
    const opts = { ...this.defaultOptions, ...options };
    
    // Check cache first
    const cached = this.cache[moduleName];
    if (cached && Date.now() - cached.timestamp < opts.cacheTimeout!) {
      if (cached.error) {
        throw cached.error;
      }
      return cached.module;
    }

    // Try to load module with retries
    for (let attempt = 1; attempt <= opts.retries!; attempt++) {
      try {
        console.log(`Loading module ${moduleName} (attempt ${attempt}/${opts.retries})`);
        
        const module = await moduleE;
        
        // Cache successful load
        this.cache[moduleName] = {
          module,
          timestamp: Date.now(),
        };
        
        console.log(`✅ Successfully loaded module ${moduleName}`);
        return module;
        
      } catch (error) {
        console.error(`❌ Failed to load module ${moduleName} (attempt ${attempt}):`, error);
        
        if (attempt === opts.retries!) {
          // Last attempt failed
          this.cache[moduleName] = {
            module: null,
            timestamp: Date.now(),
            error: error as Error,
          };
          
          if (opts.fallback) {
            console.log(`🔄 Using fallback for module ${moduleName}`);
            return opts.fallback;
          }
          
          throw error;
        }
        
        // Wait before retry
        await this.delay(opts.retryDelay!);
      }
    }
  }

  async loadModules(modules: Array<{ name: string; module: any; options?: LoadModuleOptions }>) {
    const loadPromises = modules.map(({ name, module, options }) => 
      this.loadModule(name, module, options).catch(error => {
        console.error(`Failed to load module ${name}:`, error);
        return { name, error, module };
      })
    );

    const results = await Promise.allSettled(loadPromises);
    
    return results.map((result, index) => ({
      name: modules[index].name,
      success: result.status === 'fulfilled',
      module: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    }));
  }

  clearCache(moduleName?: string) {
    if (moduleName) {
      delete this.cache[moduleName];
    } else {
      this.cache = {};
    }
  }

  getCacheStatus() {
    return Object.keys(this.cache).map(name => ({
      name,
      timestamp: this.cache[name].timestamp,
      hasError: !!this.cache[name].error,
      age: Date.now() - this.cache[name].timestamp,
    }));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create singleton instance
export const moduleLoader = new ModuleLoader();

// Predefined module configurations
export const MODULE_CONFIGS = {
  shop: {
    name: 'shop/ShopRoutes',
    module: import('shop/ShopRoutes'),
    options: {
      retries: 3,
      retryDelay: 1000,
      fallback: { default: { routes: [] } },
    },
  },
  // Add more modules as needed:
  // admin: {
  //   name: 'admin/AdminRoutes',
  //   options: {
  //     retries: 2,
  //     retryDelay: 2000,
  //     fallback: { default: { routes: [] } },
  //   },
  // },
  // dashboard: {
  //   name: 'dashboard/DashboardRoutes',
  //   options: {
  //     retries: 3,
  //     retryDelay: 1000,
  //     fallback: { default: { routes: [] } },
  //   },
  // },
} as const; 