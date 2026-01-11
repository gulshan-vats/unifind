export default function ResourcesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in zoom-in duration-500 px-4">
            <h1 className="text-4xl font-medium bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Resource Hub
            </h1>
            <p className="text-xl text-muted-foreground text-center max-w-2xl">
                Share and access high-quality study notes, guides, and academic resources.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                            <span className="text-emerald-600 font-bold">#{i}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Shared Resource</h3>
                        <p className="text-sm text-muted-foreground">
                            Access the best materials shared by fellow students in your field.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
