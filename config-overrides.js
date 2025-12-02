module.exports = function override(config, env) {
  // Modify babel-loader options to allow namespace tags
  const babelRule = config.module.rules.find(
    (rule) => rule.oneOf
  );

  if (babelRule && babelRule.oneOf) {
    // Add a rule BEFORE the SVG rule to handle modelnaya-raw.svg with file-loader
    // This prevents SVGR from processing it
    const svgRuleIndex = babelRule.oneOf.findIndex((rule) => 
      rule.test && rule.test.toString().includes('svg')
    );
    
    if (svgRuleIndex !== -1) {
      // Insert a new rule before the SVG rule for modelnaya-raw.svg
      babelRule.oneOf.splice(svgRuleIndex, 0, {
        test: /modelnaya-raw\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash][ext]'
        }
      });
    }

    babelRule.oneOf.forEach((rule) => {
      // Exclude modelnaya-raw.svg from SVGR processing
      if (rule.test && rule.test.toString().includes('svg') && rule.use) {
        // Add exclude condition for modelnaya-raw.svg
        const originalExclude = rule.exclude;
        rule.exclude = (modulePath) => {
          // Exclude modelnaya-raw.svg from SVGR
          if (modulePath && modulePath.includes('modelnaya-raw.svg')) {
            return true;
          }
          // Apply original exclude if it exists
          if (originalExclude) {
            if (typeof originalExclude === 'function') {
              return originalExclude(modulePath);
            } else if (Array.isArray(originalExclude)) {
              return originalExclude.some(ex => {
                if (ex instanceof RegExp) {
                  return ex.test(modulePath);
                }
                return modulePath.includes(ex);
              });
            } else if (originalExclude instanceof RegExp) {
              return originalExclude.test(modulePath);
            }
          }
          return false;
        };
      }

      // Configure regular babel-loader
      if (rule.loader && rule.loader.includes('babel-loader') && rule.options) {
        // Ensure plugins array exists
        if (!rule.options.plugins) {
          rule.options.plugins = [];
        }

        // Find the JSX transform plugin and update it
        const jsxPluginIndex = rule.options.plugins.findIndex(
          (plugin) => {
            const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
            return typeof pluginName === 'string' && pluginName.includes('transform-react-jsx');
          }
        );

        if (jsxPluginIndex !== -1) {
          // Update existing plugin with throwIfNamespace: false
          const plugin = rule.options.plugins[jsxPluginIndex];
          if (Array.isArray(plugin)) {
            rule.options.plugins[jsxPluginIndex] = [
              plugin[0],
              { ...(plugin[1] || {}), throwIfNamespace: false }
            ];
          } else {
            rule.options.plugins[jsxPluginIndex] = [
              plugin,
              { throwIfNamespace: false }
            ];
          }
        } else {
          // Add the plugin if it doesn't exist (shouldn't happen with react-scripts)
          rule.options.plugins.push([
            require.resolve('@babel/plugin-transform-react-jsx'),
            { throwIfNamespace: false }
          ]);
        }
      }
    });
  }

  return config;
};

