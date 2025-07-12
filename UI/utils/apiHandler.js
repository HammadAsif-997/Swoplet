export async function callApi({ url, method = 'GET', body = null, headers = {} }) {
    try {
        console.log(`API ${method} call to:`, url);

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
            console.log('Request body:', body);
        }

        // Check URL validity
        if (!url || !url.startsWith('http')) {
            console.error('Invalid API URL:', url);
            return {
                success: false,
                error: `Invalid API URL: ${url || 'undefined'}`,
                status: 0
            };
        }

        const response = await fetch(url, options);

        console.log("response", JSON.stringify(response, null, 2));

        let result;
        try {
            // First check if response is empty
            const contentType = response.headers.get('content-type');

            if (!contentType || !contentType.includes('application/json')) {
                console.warn('Response is not JSON:', contentType);
                // Try to get text for error message
                const text = await response.text();
                console.log('Non-JSON response:', text ? text.substring(0, 200) : 'Empty response');
                return {
                    success: response.ok,
                    data: [],  // Default to empty array for non-JSON responses
                    error: response.ok ? null : `Server returned non-JSON response: ${text ? text.substring(0, 50) : 'Empty response'}`,
                    status: response.status
                };
            }

            // Handle JSON response
            const text = await response.text();

            // Handle empty response
            if (!text || text.trim() === '') {
                return {
                    success: response.ok,
                    data: [],
                    error: response.ok ? null : 'Empty response from server',
                    status: response.status
                };
            }

            try {
                result = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error:', parseError, text.substring(0, 200));
                return {
                    success: false,
                    error: `Invalid JSON response: ${text.substring(0, 50)}...`,
                    status: response.status
                };
            }
        } catch (textError) {
            console.error('Failed to read response:', textError);
            return {
                success: false,
                error: 'Failed to read response: ' + textError.message,
                status: response.status
            };
        }        // Handle different response structures
        if (response.ok) {
            // Some APIs return the data directly, others wrap it in a data property
            if (result.status >= 200 && result.status < 300) {
                return {
                    success: true,
                    data: result.data,
                    message: result.message || 'Success',
                    status: result.status
                };
            } else if (Array.isArray(result)) {
                // API returns array directly
                return {
                    success: true,
                    data: result,
                    message: 'Success',
                    status: response.status
                };
            } else if (result.data !== undefined) {
                // API returns { data: ... } format
                return {
                    success: true,
                    data: result.data,
                    message: result.message || 'Success',
                    status: result.status || response.status
                };
            } else {
                // API returns data directly in the response
                return {
                    success: true,
                    data: result,
                    message: result.message || 'Success',
                    status: response.status
                };
            }
        } else {
            return {
                success: false,
                error: result.message || result.error || 'Something went wrong',
                errors: result.errors || [],
                status: result.status || response.status
            };
        }
    } catch (err) {
        return {
            success: false,
            error: err.message || 'Network error',
            status: 500
        };
    }
}
