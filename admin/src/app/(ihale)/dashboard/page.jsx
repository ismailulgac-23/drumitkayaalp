"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Icon } from "@iconify/react";
import { GroupIcon, BoxIconLine, ArrowUpIcon, ArrowDownIcon } from "@/icons";

export default function Dashboard() {
  const [statistics, setStatistics] = useState({
    last30DaysPatients: 145,
    totalRevenue: 125000,
    totalProcedures: 89,
    todayPatients: 12,
    todayRevenue: 8500,
    pendingAppointments: 8,
    completedAppointments: 67,
    activePatients: 234,
  });

  // Mock data for chart
  const dailyPatientData = [
    { date: "01", count: 5 },
    { date: "02", count: 8 },
    { date: "03", count: 12 },
    { date: "04", count: 6 },
    { date: "05", count: 15 },
    { date: "06", count: 10 },
    { date: "07", count: 9 },
    { date: "08", count: 11 },
    { date: "09", count: 13 },
    { date: "10", count: 7 },
    { date: "11", count: 14 },
    { date: "12", count: 16 },
    { date: "13", count: 8 },
    { date: "14", count: 10 },
    { date: "15", count: 12 },
    { date: "16", count: 9 },
    { date: "17", count: 11 },
    { date: "18", count: 13 },
    { date: "19", count: 7 },
    { date: "20", count: 15 },
    { date: "21", count: 8 },
    { date: "22", count: 12 },
    { date: "23", count: 10 },
    { date: "24", count: 14 },
    { date: "25", count: 9 },
    { date: "26", count: 11 },
    { date: "27", count: 13 },
    { date: "28", count: 7 },
    { date: "29", count: 15 },
    { date: "30", count: 12 },
  ];

  const maxCount = Math.max(...dailyPatientData.map(d => d.count));

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
          <div className="h-64 flex items-end justify-between gap-1">
            {dailyPatientData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  style={{ height: `${(item.count / maxCount) * 100}%` }}
                  title={`${item.date}: ${item.count} hasta`}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
              </div>
            ))}
          </div>
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

