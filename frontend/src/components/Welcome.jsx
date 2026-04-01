export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col">
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-20">
                    {/* Hero Section */}
                    <section className="text-center space-y-6 pt-24">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                            Build Better Projects,
                            <span className="block text-blue-600">Together</span>
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            A modern project management platform designed to keep your team
                            aligned, productive, and focused on what matters most.
                        </p>
                    </section>

                    {/* Features */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[{ title: "Plan Smarter", desc: "Organize projects, define milestones, and break work into clear tasks." }, { title: "Track Everything", desc: "See progress at a glance and never lose sight of deadlines." }, { title: "Work Together", desc: "Collaborate with your team using comments, assignments, and updates." }].map((f, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                                <h3 className="text-lg font-semibold text-gray-800">{f.title}</h3>
                                <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
                            </div>
                        ))}
                    </section>

                    {/* Workflow Preview */}
                    <section className="bg-white rounded-3xl shadow-md p-8 md:p-12">
                        <h2 className="text-2xl font-semibold text-gray-800 text-center">
                            Your Workflow, Visualized
                        </h2>
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[{ title: "To Do", items: ["Design homepage", "Setup database"] }, { title: "In Progress", items: ["API integration"] }, { title: "Done", items: ["Project setup"] }].map((col, i) => (
                                <div key={i} className="rounded-xl border p-4 bg-gray-50">
                                    <p className="font-medium text-gray-700">{col.title}</p>
                                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                        {col.items.map((it, idx) => (
                                            <li key={idx} className="rounded-md bg-white p-2 shadow-sm">{it}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Callout */}
                    <section className="text-center rounded-3xl p-10 md:p-14 shadow-md 
  bg-gradient-to-r from-violet-100 via-blue-100 to-white text-gray-800">
                        <h2 className="text-2xl md:text-3xl font-semibold">
                            Turn Ideas into Action
                        </h2>
                        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                            Whether you're a solo creator or a growing team, manage everything
                            in one simple workspace.
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/70 backdrop-blur border-t">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} Projectly. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-700">About</a>
                        <a href="#" className="hover:text-gray-700">Features</a>
                        <a href="#" className="hover:text-gray-700">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}