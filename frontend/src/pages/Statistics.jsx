import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, Loader2, AlertCircle, Info } from 'lucide-react';
import api from '../utils/api';

const Statistics = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/yearly-stats');
                setStats(res.data);
            } catch (err) {
                setError('Gagal memuat data statistik');
                console.error(err);
            } finally {
                setError('');
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat data statistik...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4 text-red-700">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p>{error}</p>
            </div>
        );
    }

    const maxIndividual = Math.max(...stats.map(s => s.pns), ...stats.map(s => s.pppk), 1);
    const maxScale = Math.max(maxIndividual, 5);
    const totalProjected = stats.reduce((acc, curr) => acc + curr.total, 0);

    // Grid points for Y-axis (Show every integer if maxScale is small, or 5 intervals)
    const gridCount = maxScale <= 10 ? maxScale + 1 : 6;
    const gridPoints = Array.from({ length: gridCount }, (_, i) =>
        maxScale <= 10 ? (gridCount - 1 - i) : Math.round(((gridCount - 1 - i) / (gridCount - 1)) * maxScale)
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="border-b border-gray-100 pb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Statistik Kenaikan Pangkat</h1>
                <p className="text-gray-500 mt-1 font-medium">Proyeksi jumlah pegawai yang memenuhi syarat kualifikasi per tahun.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                            Grafik Perbandingan Tahunan
                        </h3>
                        {/* Legend */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary-500 rounded-sm"></div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">PNS</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">PPPK</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] relative mt-12 mb-8 ml-10 mr-4">
                        {/* Y-Axis Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {gridPoints.map((val, idx) => (
                                <div key={idx} className="w-full border-t border-black/5 flex items-center relative">
                                    <span className="absolute -left-10 text-[10px] font-bold text-black/30">
                                        {val}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Chart Area */}
                        <div className="absolute inset-0 border-l-2 border-black/10 flex items-stretch justify-between gap-4 px-4">
                            {stats.length === 0 ? (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 italic font-medium">
                                    Belum ada data proyeksi
                                </div>
                            ) : (
                                stats.map((s) => (
                                    <div key={s.year} className="flex-1 flex flex-col items-center relative z-10">
                                        <div className="w-full flex items-end justify-center h-full gap-2 group px-2">
                                            {/* PNS Bar */}
                                            <div className="relative flex-1 max-w-[28px] flex flex-col justify-end h-full group/pns">
                                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/pns:opacity-100 transition-all bg-primary-600 text-white text-[9px] font-bold py-0.5 px-1.5 rounded-full z-20 pointer-events-none whitespace-nowrap shadow-lg">
                                                    PNS: {s.pns}
                                                </div>
                                                <div
                                                    style={{ height: `${(s.pns / maxScale) * 100}%`, minHeight: '2px' }}
                                                    className="w-full bg-primary-500 rounded-t-sm transition-all duration-500 hover:brightness-110 shadow-sm relative z-10"
                                                ></div>
                                            </div>

                                            {/* PPPK Bar */}
                                            <div className="relative flex-1 max-w-[28px] flex flex-col justify-end h-full group/pppk">
                                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/pppk:opacity-100 transition-all bg-amber-600 text-white text-[9px] font-bold py-0.5 px-1.5 rounded-full z-20 pointer-events-none whitespace-nowrap shadow-lg">
                                                    PPPK: {s.pppk}
                                                </div>
                                                <div
                                                    style={{ height: `${(s.pppk / maxScale) * 100}%`, minHeight: '2px' }}
                                                    className="w-full bg-amber-400 rounded-t-sm transition-all duration-500 hover:brightness-110 shadow-sm relative z-10"
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Baseline & Label */}
                                        <div className="absolute -bottom-10 flex flex-col items-center w-full">
                                            <div className="w-full h-0.5 bg-black"></div>
                                            <div className="mt-3 text-xs font-bold text-black/40 tracking-wider font-mono">{s.year}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* List Summary */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-medium text-gray-800">Rincian Per Tahun</h3>
                        <div className="text-[10px] text-gray-300 uppercase tracking-widest">Data Proyeksi</div>
                    </div>
                    <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1 scrollbar-hide pb-4">
                        {stats.map((s) => (
                            <div key={s.year} className="bg-white overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-primary-500" />
                                        <span className="text-sm font-medium text-gray-900">Tahun {s.year}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">Total: {s.total}</div>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                            <span className="text-sm text-gray-600 font-medium">PNS</span>
                                        </div>
                                        <span className="text-sm font-medium text-primary-600">{s.pns} <span className="text-[10px] font-normal text-gray-400">Orang</span></span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                            <span className="text-sm text-gray-600 font-medium">PPPK</span>
                                        </div>
                                        <span className="text-sm font-medium text-amber-600">{s.pppk} <span className="text-[10px] font-normal text-gray-400">Orang</span></span>
                                    </div>

                                    {/* Mini Ratio Bar */}
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                        <div
                                            style={{ width: `${(s.pns / (s.total || 1)) * 100}%` }}
                                            className="h-full bg-primary-500 transition-all duration-700"
                                        ></div>
                                        <div
                                            style={{ width: `${(s.pppk / (s.total || 1)) * 100}%` }}
                                            className="h-full bg-amber-400 transition-all duration-700"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stats.length === 0 && (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl p-10 text-center">
                                <Users className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                <p className="text-sm text-gray-400 font-medium">Data rincian kosong</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
