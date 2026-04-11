import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-lg mx-auto mt-20 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-3">Something went wrong</h2>
          <p className="text-sm text-zinc-400 mb-4">{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
