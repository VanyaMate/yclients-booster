// vite.config.ts
import { defineConfig } from "file:///D:/dev/web/javascript/yclients/node_modules/vite/dist/node/index.js";
import { crx } from "file:///D:/dev/web/javascript/yclients/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "YCLIENTS Booster",
  version: "0.0.1",
  action: {
    default_popup: "index.html"
  },
  content_scripts: [
    {
      js: [
        "src/main.ts"
      ],
      matches: [
        "https://www.yclients.com/*",
        "https://yclients.com/*"
      ],
      run_at: "document_start"
    }
  ],
  permissions: [
    "activeTab",
    "contentSettings",
    "tabs"
  ]
};

// vite.config.ts
import obfuscatorPlugin from "file:///D:/dev/web/javascript/yclients/node_modules/vite-plugin-javascript-obfuscator/dist/index.cjs.js";
var vite_config_default = defineConfig(({ mode }) => {
  const plugins = [];
  const isProductionMode = mode === "production";
  const cssScopeName = isProductionMode ? "[hash:base64:5]" : "[name]_[local]_[hash:base64:5]";
  if (isProductionMode) {
    plugins.push(obfuscatorPlugin({
      options: {
        debugProtection: true,
        // deadCodeInjection: true,         // NOT WORKING
        optionsPreset: "low-obfuscation",
        renameGlobals: true,
        // renameProperties : true,         // NOT WORKING
        splitStrings: true,
        controlFlowFlattening: true,
        transformObjectKeys: true
      }
    }));
  }
  plugins.push(crx({ manifest: manifest_default }));
  return {
    plugins,
    css: {
      modules: {
        generateScopedName: cssScopeName
      }
    },
    resolve: {
      alias: {
        "@": "/src",
        "$": "/"
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGRldlxcXFx3ZWJcXFxcamF2YXNjcmlwdFxcXFx5Y2xpZW50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZGV2XFxcXHdlYlxcXFxqYXZhc2NyaXB0XFxcXHljbGllbnRzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9kZXYvd2ViL2phdmFzY3JpcHQveWNsaWVudHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nO1xyXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9tYW5pZmVzdC5qc29uJztcclxuaW1wb3J0IG9iZnVzY2F0b3JQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tamF2YXNjcmlwdC1vYmZ1c2NhdG9yJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtdO1xyXG4gICAgY29uc3QgaXNQcm9kdWN0aW9uTW9kZSAgICAgICAgPSBtb2RlID09PSAncHJvZHVjdGlvbic7XHJcbiAgICBjb25zdCBjc3NTY29wZU5hbWUgICAgICAgICAgICA9IGlzUHJvZHVjdGlvbk1vZGUgPyAnW2hhc2g6YmFzZTY0OjVdJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ1tuYW1lXV9bbG9jYWxdX1toYXNoOmJhc2U2NDo1XSc7XHJcblxyXG4gICAgaWYgKGlzUHJvZHVjdGlvbk1vZGUpIHtcclxuICAgICAgICBwbHVnaW5zLnB1c2gob2JmdXNjYXRvclBsdWdpbih7XHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGRlYnVnUHJvdGVjdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIC8vIGRlYWRDb2RlSW5qZWN0aW9uOiB0cnVlLCAgICAgICAgIC8vIE5PVCBXT1JLSU5HXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zUHJlc2V0OiAnbG93LW9iZnVzY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgIHJlbmFtZUdsb2JhbHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAvLyByZW5hbWVQcm9wZXJ0aWVzIDogdHJ1ZSwgICAgICAgICAvLyBOT1QgV09SS0lOR1xyXG4gICAgICAgICAgICAgICAgc3BsaXRTdHJpbmdzICAgICAgICAgOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbEZsb3dGbGF0dGVuaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtT2JqZWN0S2V5cyAgOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwbHVnaW5zLnB1c2goY3J4KHsgbWFuaWZlc3QgfSkpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcGx1Z2luczogcGx1Z2lucyxcclxuICAgICAgICBjc3MgICAgOiB7XHJcbiAgICAgICAgICAgIG1vZHVsZXM6IHtcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRlU2NvcGVkTmFtZTogY3NzU2NvcGVOYW1lLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAgICAgJ0AnOiAnL3NyYycsXHJcbiAgICAgICAgICAgICAgICAnJCc6ICcvJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufSk7IiwgIntcclxuICAgIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxyXG4gICAgXCJuYW1lXCI6IFwiWUNMSUVOVFMgQm9vc3RlclwiLFxyXG4gICAgXCJ2ZXJzaW9uXCI6IFwiMC4wLjFcIixcclxuICAgIFwiYWN0aW9uXCI6IHtcclxuICAgICAgICBcImRlZmF1bHRfcG9wdXBcIjogXCJpbmRleC5odG1sXCJcclxuICAgIH0sXHJcbiAgICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcImpzXCI6IFtcclxuICAgICAgICAgICAgICAgIFwic3JjL21haW4udHNcIlxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBcIm1hdGNoZXNcIjogW1xyXG4gICAgICAgICAgICAgICAgXCJodHRwczovL3d3dy55Y2xpZW50cy5jb20vKlwiLFxyXG4gICAgICAgICAgICAgICAgXCJodHRwczovL3ljbGllbnRzLmNvbS8qXCJcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgXCJydW5fYXRcIjogXCJkb2N1bWVudF9zdGFydFwiXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFwicGVybWlzc2lvbnNcIjogW1xyXG4gICAgICAgIFwiYWN0aXZlVGFiXCIsXHJcbiAgICAgICAgXCJjb250ZW50U2V0dGluZ3NcIixcclxuICAgICAgICBcInRhYnNcIlxyXG4gICAgXVxyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUixTQUFTLG9CQUFrQztBQUNqVSxTQUFTLFdBQVc7OztBQ0RwQjtBQUFBLEVBQ0ksa0JBQW9CO0FBQUEsRUFDcEIsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsUUFBVTtBQUFBLElBQ04sZUFBaUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDZjtBQUFBLE1BQ0ksSUFBTTtBQUFBLFFBQ0Y7QUFBQSxNQUNKO0FBQUEsTUFDQSxTQUFXO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsTUFDQSxRQUFVO0FBQUEsSUFDZDtBQUFBLEVBQ0o7QUFBQSxFQUNBLGFBQWU7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBQ0o7OztBRHJCQSxPQUFPLHNCQUFzQjtBQUc3QixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN0QyxRQUFNLFVBQTBCLENBQUM7QUFDakMsUUFBTSxtQkFBMEIsU0FBUztBQUN6QyxRQUFNLGVBQTBCLG1CQUFtQixvQkFDQTtBQUVuRCxNQUFJLGtCQUFrQjtBQUNsQixZQUFRLEtBQUssaUJBQWlCO0FBQUEsTUFDMUIsU0FBUztBQUFBLFFBQ0wsaUJBQWlCO0FBQUE7QUFBQSxRQUVqQixlQUFlO0FBQUEsUUFDZixlQUFlO0FBQUE7QUFBQSxRQUVmLGNBQXVCO0FBQUEsUUFDdkIsdUJBQXVCO0FBQUEsUUFDdkIscUJBQXVCO0FBQUEsTUFDM0I7QUFBQSxJQUNKLENBQUMsQ0FBQztBQUFBLEVBQ047QUFFQSxVQUFRLEtBQUssSUFBSSxFQUFFLDJCQUFTLENBQUMsQ0FBQztBQUU5QixTQUFPO0FBQUEsSUFDSDtBQUFBLElBQ0EsS0FBUztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ0wsb0JBQW9CO0FBQUEsTUFDeEI7QUFBQSxJQUNKO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxPQUFPO0FBQUEsUUFDSCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsTUFDVDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
