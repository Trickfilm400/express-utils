#!/usr/bin/env node
import { RequestOptions } from 'http';
import * as http from 'http';
import { Config } from '../config';

new Config({});

interface HTTP_Response {
  data: {
    healthy: boolean;
    date: number;
  };
}

/**
 * @author Nico Wagner
 * @version 1.0.0
 * @since 0.1.0 01.07.2021
 */
class HealthCheck {
  constructor(runTests = true) {
    if (runTests) this.runCheckUp();
  }

  /** Run all the Tests:
   *   Request the Database Status
   *   Request a timestamp
   * @author Nico Wagner
   * @version 1.0.0
   * @since 0.1.0 - 01.07.2021 22:48
   */
  public runCheckUp() {
    console.log('Starting CheckUp...');
    this.makeHTTPRequest({
      host: 'localhost',
      port: Config.getConfig().get('port'),
      path: '/health',
    })
      .then((res) => {
        console.log(new Date(), 'Got HTTP response: ', res);
        const json: HTTP_Response = JSON.parse(res);
        console.log(json);
        if (json.data.healthy) HealthCheck.exitCode(false);
        else HealthCheck.exitCode(true);
      })
      .catch(() => {
        HealthCheck.exitCode(true);
      });
  }

  /**
   * Exits the process if parameter is true
   * @param {boolean} HealthError True: if error occurred and health check failed
   * @private
   * @author Nico Wagner
   * @version 1.0.0.
   * @since 0.1.0 01.07.2021
   */
  private static exitCode(HealthError: boolean) {
    if (HealthError) {
      console.error(
        new Date(),
        'Error on healthCheck: NOT HEALTHY... exiting.'
      );
      process.exit(1);
    }
    console.log(new Date(), 'Application seems healthy...');
    process.exit(0);
  }

  /**
   * Function for easy http request
   * @param options HTTP Parameter for request
   * @return Promise
   * @private
   * @author Nico Wagner
   * @version 1.0.0
   * @since 0.1.0 01.07.2021
   */
  private makeHTTPRequest(options: RequestOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      let data = '';
      http
        .request(options, (res) => {
          if (res.statusCode !== 200) return reject();

          res.on('data', (d) => {
            data += d;
          });
          res.once('end', () => {
            resolve(data);
          });
        })
        .end();
    });
  }
}

new HealthCheck(true);
