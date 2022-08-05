class ZampError extends Error {
  protected static errorTypes = {
    /** Network error. */
    NETWORK_ERROR: 'NETWORK_ERROR',

    /** Merchant canceled the current transaction. */
    CANCEL: 'CANCEL',

    /** Implementation error. The method or parameter are incorrect or are not supported. */
    IMPLEMENTATION_ERROR: 'IMPLEMENTATION_ERROR',

    /** Generic error. */
    ERROR: 'ERROR'
  };

  protected code: number;

  constructor(type: keyof typeof ZampError.errorTypes, message: string, code: number) {
    super(message);

    this.name = ZampError.errorTypes[type];
    this.code = code;

    console.error({ Type: this.name, Code: this.code, Message: this.message });
  }
}

export default ZampError;
