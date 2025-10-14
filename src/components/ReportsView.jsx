import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { DollarSign, TrendingUp, ShoppingCart, Calendar, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsView() {
  const { salesHistory } = useApp();
  const [reportType, setReportType] = useState('daily'); // 'daily', 'monthly', 'custom'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtrar vendas baseado no tipo de relatório
  const filteredSales = useMemo(() => {
    if (reportType === 'daily') {
      return salesHistory.filter(sale => {
        const saleDate = new Date(sale.closedAt).toISOString().split('T')[0];
        return saleDate === selectedDate;
      });
    } else if (reportType === 'monthly') {
      return salesHistory.filter(sale => {
        const saleMonth = new Date(sale.closedAt).toISOString().slice(0, 7);
        return saleMonth === selectedMonth;
      });
    } else if (reportType === 'custom' && startDate && endDate) {
      return salesHistory.filter(sale => {
        const saleDate = new Date(sale.closedAt).toISOString().split('T')[0];
        return saleDate >= startDate && saleDate <= endDate;
      });
    }
    return [];
  }, [salesHistory, reportType, selectedDate, selectedMonth, startDate, endDate]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.finalTotal, 0);
    const totalOrders = filteredSales.length;
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
    const totalItems = filteredSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    return { totalSales, totalOrders, averageTicket, totalItems };
  }, [filteredSales]);

  // Dados por categoria
  const categoryData = useMemo(() => {
    const categories = {};
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const category = item.category || 'Outros';
        if (!categories[category]) {
          categories[category] = { name: category, value: 0 };
        }
        categories[category].value += item.subtotal;
      });
    });
    return Object.values(categories);
  }, [filteredSales]);

  // Dados por dia (para gráfico de linha mensal)
  const dailyData = useMemo(() => {
    if (reportType !== 'monthly') return [];
    
    const days = {};
    filteredSales.forEach(sale => {
      const day = new Date(sale.closedAt).getDate();
      if (!days[day]) {
        days[day] = { day: `Dia ${day}`, total: 0 };
      }
      days[day].total += sale.finalTotal;
    });
    
    return Object.values(days).sort((a, b) => 
      parseInt(a.day.split(' ')[1]) - parseInt(b.day.split(' ')[1])
    );
  }, [filteredSales, reportType]);

  // Cores para o gráfico de pizza
  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const handleExportReport = () => {
    const reportData = {
      type: reportType,
      date: reportType === 'daily' ? selectedDate : reportType === 'monthly' ? selectedMonth : `${startDate} a ${endDate}`,
      stats,
      sales: filteredSales,
      categoryData
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${reportType}_${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Relatórios e Financeiro</h2>
          <p className="text-muted-foreground">Visualize e analise suas vendas</p>
        </div>
        <Button onClick={handleExportReport} disabled={filteredSales.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Seletor de tipo de relatório */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <Label className="mb-3 block">Tipo de Relatório</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Button
              variant={reportType === 'daily' ? 'default' : 'outline'}
              onClick={() => setReportType('daily')}
              className="w-full mb-2"
            >
              Diário
            </Button>
            {reportType === 'daily' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
              />
            )}
          </div>

          <div>
            <Button
              variant={reportType === 'monthly' ? 'default' : 'outline'}
              onClick={() => setReportType('monthly')}
              className="w-full mb-2"
            >
              Mensal
            </Button>
            {reportType === 'monthly' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
              />
            )}
          </div>

          <div>
            <Button
              variant={reportType === 'custom' ? 'default' : 'outline'}
              onClick={() => setReportType('custom')}
              className="w-full mb-2"
            >
              Período Customizado
            </Button>
            {reportType === 'custom' && (
              <div className="space-y-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Data inicial"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Data final"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-500">R$ {stats.totalSales.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total de Vendas</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">{stats.totalOrders}</span>
          </div>
          <p className="text-sm text-muted-foreground">Comandas Fechadas</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold text-accent">R$ {stats.averageTicket.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Ticket Médio</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">{stats.totalItems}</span>
          </div>
          <p className="text-sm text-muted-foreground">Itens Vendidos</p>
        </div>
      </div>

      {/* Gráficos */}
      {filteredSales.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de vendas por categoria */}
          {categoryData.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Vendas por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Gráfico de vendas diárias (mensal) */}
          {reportType === 'monthly' && dailyData.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Vendas Diárias do Mês</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    formatter={(value) => `R$ ${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center mb-6">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Nenhuma venda encontrada para o período selecionado</p>
        </div>
      )}

      {/* Lista de vendas */}
      {filteredSales.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Histórico de Vendas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Data/Hora</th>
                  <th className="text-left py-3 px-4">Mesa</th>
                  <th className="text-left py-3 px-4">Cliente</th>
                  <th className="text-right py-3 px-4">Itens</th>
                  <th className="text-right py-3 px-4">Total</th>
                  <th className="text-right py-3 px-4">Desconto</th>
                  <th className="text-right py-3 px-4">Final</th>
                  <th className="text-center py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="table-row-hover border-b border-border/50">
                    <td className="py-3 px-4">
                      {new Date(sale.closedAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">Mesa {sale.tableId}</td>
                    <td className="py-3 px-4">{sale.customerName || '-'}</td>
                    <td className="text-right py-3 px-4">
                      {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="text-right py-3 px-4">R$ {sale.total.toFixed(2)}</td>
                    <td className="text-right py-3 px-4 text-green-500">
                      {sale.discount > 0 ? `- R$ ${sale.discount.toFixed(2)}` : '-'}
                    </td>
                    <td className="text-right py-3 px-4 font-bold text-primary">
                      R$ {sale.finalTotal.toFixed(2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(sale);
                          setShowDetailModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalhes da venda */}
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content p-6 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Detalhes da Venda</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowDetailModal(false)}>
                <span className="text-2xl">×</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Data/Hora</p>
                    <p className="font-semibold">{new Date(selectedOrder.closedAt).toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mesa</p>
                    <p className="font-semibold">Mesa {selectedOrder.tableId}</p>
                  </div>
                  {selectedOrder.customerName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-semibold">{selectedOrder.customerName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Itens</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-card border border-border rounded-lg p-3">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-primary">R$ {item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>R$ {selectedOrder.total.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-500">
                    <span>Desconto:</span>
                    <span>- R$ {selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold pt-2 border-t border-primary/30">
                  <span>Total:</span>
                  <span className="text-primary">R$ {selectedOrder.finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

