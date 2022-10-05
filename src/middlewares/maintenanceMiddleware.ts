import { NextFunction, Request, Response } from 'express';
import { Config, HttpExceptions, logger } from '../index';

/**
 * This class is all about the maintenance mode
 * You can control if the mode is enabled or not and fetches its value
 * @author Nico
 * @version 1
 * @since 26.06.2021
 * @class
 */
abstract class MaintenanceMiddleware {
  private static _instance: MaintenanceMiddleware;

  static getInstance(): MaintenanceMiddleware {
    return this._instance;
  }

  /**
   * Variable to store the maintenance mode value to not fetch the value every request
   *
   * This may change in the future to prevent caching issues
   * @private
   * @author Nico
   * @version 1
   * @since 26.06.2021
   */
  private _isEnabled = true;

  /**
   * Variable to store the Timestamp for the last Update of the maintenance mode
   *
   * @private
   * @author Jens Hummel
   * @version 1
   * @since 26.06.2021
   */
  private lastCheck: Date;

  /**
   * Fetches the initial value of the maintenance state for the API
   * @author Nico
   * @version 1
   * @since 26.06.2021
   * @constructor
   */
  constructor(defaultState = false) {
    MaintenanceMiddleware._instance = this;
    this._isEnabled = defaultState;
    this.getEnabledStatus()
      .then((value) => {
        this._isEnabled = value;
        this.lastCheck = new Date();
      })
      .catch(logger.error);
  }

  /**
   * Fetches the maintenance mode state of the DB & arses it to a boolean
   * @return Promise
   * @private
   * @author Nico
   * @version 1
   * @since 26.06.2021 02:15
   * Updated 05.10.2022 07:02
   */
  abstract getEnabledStatus(): Promise<boolean>;

  /**
   * Getter function for the isEnabled boolean
   * @author Nico
   * @return boolean - The maintenance mode state
   * @version 1
   * @since 26.06.2021
   */
  public get isEnabled(): boolean {
    return this._isEnabled;
  }

  /**
   * @param newState
   * Updated 05.10.2022 07:02
   */
  public set isEnabled(newState: boolean) {
    this._isEnabled = newState;
  }

  /**
   * Set the maintenance mode
   * - Checks if maintenance mode is already active / not active
   * - Saves new value in DB
   * @param {boolean}newValue - The new State of the maintenance mode
   * @return Promise
   * @author Nico, Jens Hummel
   * @version 1.1
   * @since 26.06.2021 02:24
   * Updated 05.10.2022 07:02
   */
  abstract setMaintenanceStatus(newValue: boolean): Promise<boolean>;

  /**
   * Checks for the maintenance mode status
   *
   * If enabled, send error and end request, else, call next()
   * @param {Request}_req - Express Request
   * @param _res
   * @param {NextFunction}next - Express NextFunction
   * @author Nico, Jens Hummel
   * @version 2
   * @since 26.06.2021 03:02
   */
  public ExpressMiddleWare = (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    //skip maintenance mode for testing purposes
    if (Config.getConfig().get('env') === 'test') return next();

    this.checkUpdate();

    logger.debug('Maintenance Middleware called.');

    if (this.isEnabled) {
      logger.debug('Request during maintenance!');
      return next(
        new HttpExceptions.HttpException(401, 'Maintenance mode enabled')
      );
    }

    next();
  };

  /**
   * Periodical check, if Maintenance Mode status changed
   *
   * @author Jens Hummel
   * @version 1
   * @since 26.06.2021 12:15
   */
  private checkUpdate() {
    const currentDate = new Date();

    if (
      this.lastCheck?.getMilliseconds() + 1000 * 60 * 5 <
      currentDate.getMilliseconds()
    ) {
      this.getEnabledStatus()
        .then((value) => {
          if (value !== null && value != this.isEnabled) {
            logger.info('Maintenance Mode ' + value ? 'enabled' : 'disabled');
            this._isEnabled = value;
            this.lastCheck = currentDate;
          }
        })
        .catch(console.log);
    }
  }
}

export default MaintenanceMiddleware;
