export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Reading List Tracker</h1>
        </div>
      </nav>

      {/* Placeholder Reading List Section */}
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Reading List</h2>
        <p className="text-gray-600">Your reading list will appear here.</p>
      </section>
    </main>
  );
}
