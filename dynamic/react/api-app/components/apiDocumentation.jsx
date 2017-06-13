import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import ReactMarkdown from 'react-markdown';
import ApiDocumentationParam from './apiDocumentationParam';
import ApiDocModelLink from './apiDocModelLink';

const UrlHelper = ({endpoint}) => {
    if (endpoint.productionPath) {
        return (
            <span>
                <tr>
                    <th>{'URL (SANDBOX)'}</th>
                    <td>{endpoint.path}</td>
                </tr>
                <tr>
                    <th>{'URL (PRODUCTION)'}</th>
                    <td>{endpoint.productionPath}</td>
                </tr>
            </span>
        );
    }

    return (
        <tr>
            <th>{'URL'}</th>
            <td>{endpoint.path}</td>
        </tr>
    );
};

const ApiDocumentation = ({endpoint}) => (
    <div>
        <h1 id={endpoint.operationId}>{endpoint.operationId}</h1>
        <table className='styled-table'>
            <thead>
                <tr>
                    <th>{'Purpose'}</th>
                    <td>{endpoint.name}</td>
                </tr>
                <tr>
                    <th>{'HTTP Verb'}</th>
                    <td>{endpoint.action.toUpperCase()}</td>
                </tr>
                <tr>
                    <th>{'REST Path'}</th>
                    <td>{decodeURI(url.parse(endpoint.path).pathname)}</td>
                </tr>
                <UrlHelper endpoint={endpoint} />
                <tr>
                    <th>{'Query String'}</th>
                    <td>{(endpoint.queryString) ? '?' : ''}{Object.keys(endpoint.queryString || {}).join('&')}</td>
                </tr>
                <tr>
                    <th>{'Response Type'}</th>
                    <td>
                        <ApiDocModelLink refSchema={endpoint.responseSchemaWithRefs} />
                    </td>
                </tr>
                <tr>
                    <th>{'Content-Type'}</th>
                    <td>{endpoint.produces.join(', ')}</td>
                </tr>
            </thead>
        </table>
        <h3 id='description'>{'Description'}</h3>
        <ReactMarkdown source={endpoint.description || ''} />
        <h3 id='parameters'>{'Parameters'}</h3>
        <table className='styled-table'>
            <thead>
                <tr>
                    <th>{'Location'}</th>
                    <th>{'Parameter'}</th>
                    <th>{'Attributes'}</th>
                    <th>{'Summary'}</th>
                </tr>
            </thead>
            <ApiDocumentationParam params={endpoint.pathParams} type={'UriPath'} />
            <ApiDocumentationParam params={endpoint.headerParams} type={'Header'} />
            <ApiDocumentationParam params={endpoint.queryString} type={'QueryString'} />
            {endpoint.requestSchemaWithRefs ?
                <tbody>
                    <tr>
                        <td>{'RequestBody'}</td>
                        <td>{'Model'}</td>
                        <td>
                            <ApiDocModelLink refSchema={endpoint.requestSchemaWithRefs} />
                        </td>
                        <td>
                            {endpoint.requestSchemaWithRefs.description || null}
                        </td>
                    </tr>
                </tbody> :
                null
            }
        </table>
    </div>
);

ApiDocumentation.displayName = 'API Documentation';
ApiDocumentation.propTypes = {
    endpoint: PropTypes.object
};
UrlHelper.displayName = 'Url Helper';
UrlHelper.propTypes = {
    endpoint: PropTypes.object
};


export default ApiDocumentation;
