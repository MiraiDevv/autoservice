import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Check,
    X,
    DollarSign,
    CreditCard,
    QrCode,
    Trash2,
    Download,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';

interface ServiceOrder {
    id: number;
    clientName: string;
    phoneNumber: string;
    carModel: string;
    serviceType: string;
    serviceValue: number;
    status: 'PENDING' | 'COMPLETED';
    paymentMethod?: 'CASH' | 'CARD' | 'PIX';
}

const ITEMS_PER_PAGE = 5;

export function ServiceOrderList() {
    const [orders, setOrders] = useState<ServiceOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
    const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'CASH' | 'CARD' | 'PIX' | 'PENDING'>('ALL');

    // Calcular índices para paginação
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    // Funções de ordenação e filtragem
    const sortOrders = (orders: ServiceOrder[]) => {
        return [...orders].sort((a, b) => {
            // Primeiro, identifica se os itens devem ir para o final
            // (status COMPLETED + tem pagamento)
            const aComplete = a.status === 'COMPLETED' && a.paymentMethod;
            const bComplete = b.status === 'COMPLETED' && b.paymentMethod;

            // Se um está completo (pronto + pagamento) e outro não
            if (aComplete && !bComplete) return 1;  // a vai para o final
            if (!aComplete && bComplete) return -1; // b vai para o final

            // Se nenhum está completo ou ambos estão completos,
            // mantém a ordem original baseada no ID
            return a.id - b.id;
        });
    };

    const filterOrders = (orders: ServiceOrder[]) => {
        return orders.filter(order => {
            // Aplica filtro de busca
            const searchMatch =
                order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phoneNumber.includes(searchTerm) ||
                order.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()));

            // Aplica filtro de status
            const statusMatch =
                statusFilter === 'ALL' ||
                order.status === statusFilter;

            // Aplica filtro de pagamento
            const paymentMatch =
                paymentFilter === 'ALL' ||
                (paymentFilter === 'PENDING' && !order.paymentMethod) ||
                order.paymentMethod === paymentFilter;

            return searchMatch && statusMatch && paymentMatch;
        });
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/service-orders');
            const data = await response.json();
            setOrders(sortOrders(data));
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/service-orders/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchOrders();
                }
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    const handleStatusUpdate = async (id: number, status: 'PENDING' | 'COMPLETED') => {
        try {
            await fetch(`http://localhost:8080/api/service-orders/${id}/status?status=${status}`, {
                method: 'PUT',
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePaymentUpdate = async (id: number, paymentMethod: 'CASH' | 'CARD' | 'PIX') => {
        try {
            await fetch(`http://localhost:8080/api/service-orders/${id}/payment?paymentMethod=${paymentMethod}`, {
                method: 'PUT',
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch('http://localhost:5000/export');

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = response.headers.get('content-disposition')?.split('filename=')[1] || 'service_orders.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                throw new Error('Falha ao exportar');
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Erro ao exportar dados!');
        }
    };

    // Funções de navegação
    const nextPage = () => {
        setCurrentPage(curr => Math.min(curr + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage(curr => Math.max(curr - 1, 1));
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Processar os pedidos com filtros e ordenação
    const filteredOrders = filterOrders(sortOrders(orders));
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
        // Volta para a primeira página quando os filtros mudam
        setCurrentPage(1);
    }, [filteredOrders.length]);

    return (
        <Card className="w-full bg-white shadow-sm">
            <CardHeader className="bg-gray-50 border-b">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                            Ordens de Serviço
                        </CardTitle>
                        <Button
                            onClick={handleExport}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Download className="h-4 w-4 mr-2"/>
                            Exportar CSV
                        </Button>
                    </div>
                    <div className="flex gap-4">
                        {/* Campo de Busca */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500"/>
                                <Input
                                    placeholder="Pesquisar por cliente, telefone, carro, serviço..."
                                    className="pl-8 bg-white border-gray-300 text-gray-900"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Filtro de Status */}
                        <Select
                            value={statusFilter}
                            onValueChange={(value: 'ALL' | 'PENDING' | 'COMPLETED') => setStatusFilter(value)}
                        >
                            <SelectTrigger className="w-[180px] bg-white border-gray-300 text-gray-900">
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-300">
                                <SelectItem value="ALL" className="text-gray-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
                                    Todos os status
                                </SelectItem>
                                <SelectItem value="PENDING" className="text-gray-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
                                    Pendentes
                                </SelectItem>
                                <SelectItem value="COMPLETED" className="text-gray-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
                                    Prontos
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Filtro de Pagamento */}
                        <Select
                            value={paymentFilter}
                            onValueChange={(value: 'ALL' | 'CASH' | 'CARD' | 'PIX' | 'PENDING') => setPaymentFilter(value)}
                        >
                            <SelectTrigger className="w-[180px] bg-white border-gray-300 text-gray-900">
                                <SelectValue placeholder="Filtrar por pagamento" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-300">
                                <SelectItem value="ALL" className="text-gray-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
                                    Todos os pagamentos
                                </SelectItem>
                                <SelectItem value="PENDING" className="text-gray-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
                                    Pagamento Pendente
                                </SelectItem>
                                <SelectItem value="CASH" className="text-gray-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
                                    Dinheiro
                                </SelectItem>
                                <SelectItem value="CARD" className="text-gray-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
                                    Cartão
                                </SelectItem>
                                <SelectItem value="PIX" className="text-gray-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
                                    PIX
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100 border-b">
                                <TableHead className="text-gray-900 font-semibold">Cliente</TableHead>
                                <TableHead className="text-gray-900 font-semibold">Telefone</TableHead>
                                <TableHead className="text-gray-900 font-semibold">Carro</TableHead>
                                <TableHead className="text-gray-900 font-semibold">Serviço</TableHead>
                                <TableHead className="text-gray-900 font-semibold text-right">Valor</TableHead>
                                <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                                <TableHead className="text-gray-900 font-semibold">Pagamento</TableHead>
                                <TableHead className="text-gray-900 font-semibold text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="border-b hover:bg-gray-50 transition-colors"
                                    >
                                        <TableCell className="text-gray-900 font-medium">
                                            {order.clientName}
                                        </TableCell>
                                        <TableCell className="text-gray-900">
                                            {order.phoneNumber}
                                        </TableCell>
                                        <TableCell className="text-gray-900">
                                            {order.carModel}
                                        </TableCell>
                                        <TableCell className="text-gray-900">
                                            {order.serviceType}
                                        </TableCell>
                                        <TableCell className="text-gray-900 text-right">
                                            {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(order.serviceValue)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {order.status === 'COMPLETED' ? (
                                                    <Badge className="bg-green-100 text-green-800">Pronto</Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(
                                                        order.id,
                                                        order.status === 'PENDING' ? 'COMPLETED' : 'PENDING'
                                                    )}
                                                >
                                                    {order.status === 'PENDING' ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <X className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {order.status === 'COMPLETED' && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePaymentUpdate(order.id, 'CASH')}
                                                        className={order.paymentMethod === 'CASH' ? 'bg-green-100' : ''}
                                                    >
                                                        <DollarSign className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePaymentUpdate(order.id, 'CARD')}
                                                        className={order.paymentMethod === 'CARD' ? 'bg-green-100' : ''}
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePaymentUpdate(order.id, 'PIX')}
                                                        className={order.paymentMethod === 'PIX' ? 'bg-green-100' : ''}
                                                    >
                                                        <QrCode className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDelete(order.id)}
                                                className="h-8 w-8 bg-red-600 hover:bg-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        Nenhuma ordem de serviço cadastrada
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Paginação */}
                {filteredOrders.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-gray-700">
                               Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredOrders.length)} de {filteredOrders.length} registros
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {/* Botões de página */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === currentPage ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => goToPage(pageNum)}
                                        className={`w-8 ${
                                            pageNum === currentPage
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}