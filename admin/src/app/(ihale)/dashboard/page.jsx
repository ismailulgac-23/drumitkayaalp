"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Icon } from "@iconify/react";
import axios from "@/axios";

export default function Dashboard() {
  const [statistics, setStatistics] = useState({
    last30DaysPatients: 0,
    totalRevenue: 0,
    totalProcedures: 0,
    todayPatients: 0,
    todayRevenue: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activePatients: 0,
  });
  const [dailyPatientData, setDailyPatientData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dashboard/statistics');
      if (response.data.success) {
        setStatistics(response.data.data);
        setDailyPatientData(response.data.data.dailyPatientData || []);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      alert('İstatistikler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const maxCount = dailyPatientData.length > 0 
    ? Math.max(...dailyPatientData.map(d => d.count), 1)
    : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Yükleniyor...</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
              <Icon icon="ri:user-line" className="text-blue-600 text-2xl dark:text-blue-400" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  30 Günlük Hasta Girişi
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {statistics.last30DaysPatients}
                </h4>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
              <Icon icon="ri:money-dollar-circle-line" className="text-green-600 text-2xl dark:text-green-400" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Toplam Ciro
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  ₺{statistics.totalRevenue.toLocaleString('tr-TR')}
                </h4>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
              <Icon icon="ri:medical-kit-line" className="text-purple-600 text-2xl dark:text-purple-400" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Toplam İşlem
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {statistics.totalProcedures}
                </h4>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
              <Icon icon="ri:calendar-check-line" className="text-orange-600 text-2xl dark:text-orange-400" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Bekleyen Randevular
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {statistics.pendingAppointments}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <ComponentCard title="30 Günlük Hasta Girişi Grafiği">
          {dailyPatientData.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-1">
              {dailyPatientData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                    title={`${item.date}: ${item.count} hasta`}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Henüz veri bulunmamaktadır
            </div>
          )}
        </ComponentCard>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <ComponentCard title="Bugünkü İstatistikler">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bugünkü Hasta</span>
                <span className="font-semibold text-gray-800 dark:text-white">{statistics.todayPatients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bugünkü Ciro</span>
                <span className="font-semibold text-gray-800 dark:text-white">₺{statistics.todayRevenue.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Randevu Durumu">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{statistics.completedAppointments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bekleyen</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{statistics.pendingAppointments}</span>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Hasta Bilgileri">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Aktif Hasta</span>
                <span className="font-semibold text-gray-800 dark:text-white">{statistics.activePatients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Toplam İşlem</span>
                <span className="font-semibold text-gray-800 dark:text-white">{statistics.totalProcedures}</span>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
