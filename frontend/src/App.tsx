import { ServiceOrderForm } from './components/ServiceOrderForm'
import { ServiceOrderList } from './components/ServiceOrderList'

function App() {
    return (
        // Div principal com width e height screen
        <div className="w-screen min-h-screen bg-slate-100 overflow-x-hidden">
            {/* Navbar com width screen */}
            <nav className="w-screen bg-slate-800 text-white py-4">
                <div className="px-6">
                    <h1 className="text-2xl font-bold">
                        Sistema de Gerenciamento de Serviços Automotivos
                    </h1>
                </div>
            </nav>

            {/* Main content com width screen e padding */}
            <main className="w-screen p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Novo Serviço
                            </h2>
                            <ServiceOrderForm />
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-lg shadow-md">
                            <ServiceOrderList />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App