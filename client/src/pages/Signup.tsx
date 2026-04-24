export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded-lg"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg"
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          Create Account
        </button>
      </div>
    </div>
  );
}
