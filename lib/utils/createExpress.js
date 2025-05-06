// createExpress.js:

import express from "express";
import compression from "compression";
import morgan from "morgan";
import fileupload from "express-fileupload";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import { engine as exphbs } from "express-handlebars";
import connectMongoDBSession from "connect-mongodb-session";
import createTenants from "./createTenants.js";

export default async function createExpress(config) {
  const app = express();

  // === 1. Tenant Setup ===
  app.tenants = await createTenants(config);
  app.use(app.tenants.middleware);
  console.debug("tenants.middleware bound to express");

  // === 2. Compression ===
  app.use(compression());

  // === 3. Body Parsers ===
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // === 4. Cookie Parser ===
  app.use(cookieParser());

  // === 5. MongoDB Session Store ===
  const MongoDBStore = connectMongoDBSession(session);
  const store = new MongoDBStore({
    uri: config.db_url,
    collection: config.session_collection_name,
  });

  store.on("error", err => {
    console.error("MongoDB Session Error:", err);
  });

  app.use(
    session({
      secret: config.session_secret,
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: config.session_timeout * 60000,
        sameSite: "Lax",
      },
    })
  );

  // === 6. Development Logging ===
  if (process.env.NODE_ENV?.toLowerCase() === "dev") {
    app.use(morgan("dev"));
  }

  // === 7. File Uploads ===
  app.use(fileupload());

  // === 8. Security Middleware ===
  app.use(helmet());
  app.use(xss());

  // === 9. Rate Limiting ===
  app.use(
    rateLimit({
      windowMs: config.rate_limit_minutes * 60000,
      max: config.rate_limit_requests,
    })
  );

  // === 10. Prevent HTTP Parameter Pollution ===
  app.use(hpp());

  // === 11. Enable CORS ===
  app.use(cors());

  // === 12. Static Files ===
  app.use(
    express.static(config.path_static, {
      maxAge: "1y",
      etag: true,
    })
  );

  // === 13. Handlebars View Engine ===
  app.engine(
    "hbs",
    exphbs({
      defaultLayout: config.path_views_default_layout,
      layoutsDir: config.path_views_layouts,
      partialsDir: config.path_views_partials,
      extname: "hbs",
    })
  );
  app.set("view engine", "hbs");
  app.set("views", config.path_views);

  if (process.env.NODE_ENV?.toLowerCase() === "production") {
    app.enable("view cache");
  }

  // === 14. attach function to add feature routers
  app.addFeatures = async featureModules => {
    for (const feature of featureModules) {
      try {
        const { default: router } = await import(
          `../features/${feature}/router.js`
        );
        app.use(router);
      } catch (err) {
        console.error(
          `[FeatureLoader] Failed to load feature "${feature}": ${err.message}`
        );
      }
    }
  };

  return app;
}
