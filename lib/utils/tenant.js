// tenant.js:

import Confirm from "confirm-json";
import { serverLog } from "./serverLog.js";

export default class Tenant {
  #config;
  #site;
  #errors = [];
  #createServices = {};
  #services = {};

  constructor(config, createServices) {
    const validator = new Confirm(config);
    validator
      .isInteger("tenant_id", undefined, 1, 1000000)
      .isString("domain", undefined, 1, 255)
      .isString("db_url", undefined, 1, 255)
      .isString("log_collection_name", "logs", 1, 255)
      .isString("mailer_host", undefined, 1, 255)
      .isInteger("mailer_port", undefined, 1, 65000)
      .isString("mailer_sender", undefined, 1, 255);

    this.#errors = validator.errors;
    this.#config = config;

    // Store createServices object to be used in the init method
    this.#createServices = createServices;

    // Initialize the private #site field with all config keys starting with "site_"
    this.#site = {};
    for (const [key, value] of Object.entries(config)) {
      if (key.startsWith("site_")) {
        this.#site[key] = value;
      }
    }
  }

  // Initialize all createServices asynchronously
  async init() {
    // If the config is invalid, throw an error
    if (this.#errors.length > 0) {
      throw new Error(`Tenant ${this.domain}: ${this.#errors.join(", ")}`);
    }

    try {
      // Loop through all createServices in the createServices object and initialize them
      for (const [serviceName, createServiceFn] of Object.entries(
        this.#createServices
      )) {
        if (typeof createServiceFn !== "function") {
          throw new Error(`Service ${serviceName} is not a valid function.`);
        }

        // Dynamically call the service creation function and assign the result to the #services class field
        this.#services[serviceName] = await createServiceFn(this.#config);
      }

      // Log successful initialization
      serverLog.info(`Tenant ${this.domain}: Initialized successfully.`);
    } catch (err) {
      // Log any errors encountered during initialization
      serverLog.error(
        `Tenant ${this.domain}: Initialization failed - ${err.message}`
      );
      throw err;
    }
  }

  // Getter methods for tenant properties
  get tenantId() {
    return this.#config.tenant_id;
  }

  get domain() {
    return this.#config.domain;
  }

  get config() {
    return this.#config;
  }

  get site() {
    return this.#site;
  }

  get services() {
    return this.#services;
  }

  get errors() {
    return [...this.#errors];
  }
}
