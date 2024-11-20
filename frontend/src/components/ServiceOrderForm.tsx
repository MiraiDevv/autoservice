import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ServiceOrderFormData {
    clientName: string;
    phoneNumber: string;
    carModel: string;
    serviceType: string;
    serviceValue: string;
}

export function ServiceOrderForm() {
    const [formData, setFormData] = React.useState<ServiceOrderFormData>({
        clientName: '',
        phoneNumber: '',
        carModel: '',
        serviceType: '',
        serviceValue: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/service-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    serviceValue: parseFloat(formData.serviceValue)
                }),
            });

            if (response.ok) {
                setFormData({
                    clientName: '',
                    phoneNumber: '',
                    carModel: '',
                    serviceType: '',
                    serviceValue: ''
                });
                alert('Serviço cadastrado com sucesso!');
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                alert('Erro ao cadastrar serviço!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao cadastrar serviço!');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="clientName" className="text-gray-700 font-medium">
                    Nome do Cliente
                </Label>
                <Input
                    id="clientName"
                    placeholder="Digite o nome do cliente"
                    className="w-full bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">
                    Telefone
                </Label>
                <Input
                    id="phoneNumber"
                    placeholder="(00) 00000-0000"
                    className="w-full bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="carModel" className="text-gray-700 font-medium">
                    Modelo do Carro
                </Label>
                <Input
                    id="carModel"
                    placeholder="Marca e modelo do veículo"
                    className="w-full bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-gray-700 font-medium">
                    Tipo de Serviço
                </Label>
                <Input
                    id="serviceType"
                    placeholder="Descreva o serviço"
                    className="w-full bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="serviceValue" className="text-gray-700 font-medium">
                    Valor
                </Label>
                <Input
                    id="serviceValue"
                    type="number"
                    step="0.01"
                    placeholder="R$ 0,00"
                    className="w-full bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.serviceValue}
                    onChange={(e) => setFormData({...formData, serviceValue: e.target.value})}
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
                Cadastrar Serviço
            </Button>
        </form>
    );
}