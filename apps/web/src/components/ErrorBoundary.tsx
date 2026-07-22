import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          {errorStatus && (
            <h1 className="mb-4 text-6xl font-bold text-foreground">
              {errorStatus}
            </h1>
          )}
          <h2 className="mb-2 text-2xl font-semibold text-foreground">
            Oops! Something went wrong
          </h2>
          <p className="mb-6 text-foreground-subtle">{errorMessage}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="theme-button-secondary-prominent"
          >
            Go Back
          </button>
          <Link
            to="/"
            className="theme-button-primary"
          >
            Go Home
          </Link>
        </div>

        {import.meta.env.DEV && error instanceof Error && (
          <details className="mt-8 text-left">
            <summary className="mb-2 cursor-pointer text-foreground-subtle hover:text-foreground-muted">
              Error Details (dev only)
            </summary>
            <pre className="overflow-auto rounded bg-surface-strong p-4 text-xs text-red-500 dark:text-red-400">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
