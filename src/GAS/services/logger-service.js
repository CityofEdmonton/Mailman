var LoggerService = {
    fatal: function() {
        logger.fatal.apply(logger, arguments);
    },

    error: function() {
        logger.error.apply(logger, arguments);
    },

    warn: function() {
        logger.warn.apply(logger, arguments);
    },

    info: function() {
        logger.info.apply(logger, arguments);
    },

    debug: function() {
        logger.debug.apply(logger, arguments);
    },

    verbose: function() {
        logger.verbose.apply(logger, arguments);
    }

}