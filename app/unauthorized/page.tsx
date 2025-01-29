"use client"

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-red-600">アクセスが拒否されました</h1>
        <p className="text-center text-gray-600">
          このページにアクセスするには、ログインが必要です。
        </p>
        <div className="text-center">
          <a
            href="/app/login"
            className="inline-block bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ログインページへ
          </a>
        </div>
      </div>
    </div>
  )
}
