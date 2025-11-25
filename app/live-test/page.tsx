import { setValue, getValue } from '@/lib/redis-utils'

export default async function LiveTestPage() {
  let testResult = {
    success: false,
    error: '',
    data: null
  }

  try {
    // Simple test - set and get a value
    const testData = {
      message: 'Hello from Production Redis!',
      timestamp: new Date().toISOString(),
      environment: 'production',
      status: 'connected'
    }

    // Remove the third argument (300) since setValue only takes 2 arguments
    await setValue('production_test', testData)
    const retrieved = await getValue('production_test')

    testResult = {
      success: true,
      error: '',
      data: retrieved
    }
  } catch (error: any) {
    testResult = {
      success: false,
      error: error.message,
      data: null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Redis Live Test
        </h1>
        
        <div className={`p-4 rounded-lg mb-6 ${
          testResult.success 
            ? 'bg-green-100 border border-green-300 text-green-800' 
            : 'bg-red-100 border border-red-300 text-red-800'
        }`}>
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              testResult.success ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="font-semibold">
              {testResult.success ? '✅ Redis Connection Successful' : '❌ Redis Connection Failed'}
            </span>
          </div>
          {testResult.error && (
            <p className="text-sm mt-2">Error: {testResult.error}</p>
          )}
        </div>

        {testResult.success && testResult.data && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-900 mb-2">Retrieved Data from Redis:</h2>
            <pre className="text-sm text-blue-800 whitespace-pre-wrap">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}