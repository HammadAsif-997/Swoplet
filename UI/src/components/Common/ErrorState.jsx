const ErrorState = ({ message = "Something went wrong", onRetry }) => (
    <div className="text-center py-8">
        <p className="text-red-500">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Try Again
            </button>
        )}
    </div>
);

export default ErrorState;
