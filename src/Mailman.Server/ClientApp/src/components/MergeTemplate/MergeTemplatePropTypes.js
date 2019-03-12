import PropTypes from 'prop-types';

export const mergeTemplateInfoShape = PropTypes.shape({
    emailTemplate: PropTypes.shape({
        to: PropTypes.string.isRequired,
        cc: PropTypes.string,
        bcc: PropTypes.string,
        subject: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired
    }),
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    createdBy: PropTypes.string.isRequired,
    createdDateUtc: PropTypes.string.isRequired,
    version: PropTypes.any,
    title: PropTypes.string.isRequired,
    sheetName: PropTypes.string.isRequired,
    headerRowNumber: PropTypes.number.isRequired,
    timestampColumn: PropTypes.shape({
        name: PropTypes.string.isRequired,
        shouldPrefixNameWithMergeTemplateTitle: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired,
    conditional: PropTypes.string.isRequired,
    repeater: PropTypes.string.isRequired
});

export const mergeTemplateArrayShape = PropTypes.arrayOf(mergeTemplateInfoShape);