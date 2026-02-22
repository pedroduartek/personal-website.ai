import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()

  let errorMessage: string
  let errorStatus: number | undefined

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage = error.statusText || 'An error occurred'
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = 'An unexpected error occurred'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          {errorStatus && (
            <h1 className="text-6xl font-bold text-white mb-4">
              {errorStatus}
            </h1>
          )}
          <h2 className="text-2xl font-semibold text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-400 mb-6">{errorMessage}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="rounded-lg bg-gray-700 px-6 py-3 text-white hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
          <Link
            to="/"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-500 transition-colors"
          >
            Go Home
          </Link>
        </div>

        {import.meta.env.DEV && error instanceof Error && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">
              Error Details (dev only)
            </summary>
            <pre className="bg-gray-900 p-4 rounded text-xs text-red-400 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
