import { isBefore, isAfter, setDate, addMonths, subMonths, differenceInDays, startOfDay, isSameDay } from 'date-fns';
import type { Expense } from '../types';

export function getCycleDates(startDay: number, currentDate = new Date()) {
  const today = startOfDay(currentDate);
  let cycleStart = setDate(today, startDay);
  
  // If today is before the cycle start day for this month, the cycle started last month
  if (isBefore(today, cycleStart)) {
    cycleStart = subMonths(cycleStart, 1);
  }
  
  // The cycle ends on the day before the startDay of the next month
  const nextMonthCycleStart = addMonths(cycleStart, 1);
  const cycleEnd = startOfDay(new Date(nextMonthCycleStart.getTime() - 24 * 60 * 60 * 1000));

  return { cycleStart, cycleEnd };
}

export function calculateBudget(totalIncome: number, startDay: number, expenses: Expense[], currentDate = new Date()) {
  const { cycleStart, cycleEnd } = getCycleDates(startDay, currentDate);
  const today = startOfDay(currentDate);
  
  const currentCycleExpenses = expenses.filter(exp => {
    const expDate = startOfDay(new Date(exp.date));
    return (isAfter(expDate, cycleStart) || isSameDay(expDate, cycleStart)) && 
           (isBefore(expDate, cycleEnd) || isSameDay(expDate, cycleEnd));
  });

  const totalSpent = currentCycleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingValue = totalIncome - totalSpent;
  
  const totalDaysInCycle = differenceInDays(cycleEnd, cycleStart) + 1;
  const daysPassed = differenceInDays(today, cycleStart) + 1;
  const remainingDays = totalDaysInCycle - daysPassed + 1; // including today

  const dailyLimit = remainingDays > 0 ? (remainingValue / remainingDays) : remainingValue;
  const percentageSpent = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0;
  
  // Behavioral check
  let isOverspendingEarly = false;
  if (daysPassed <= Math.min(5, Math.ceil(totalDaysInCycle * 0.2)) && percentageSpent > 50) {
    isOverspendingEarly = true;
  }

  return {
    totalSpent,
    remainingValue,
    totalDaysInCycle,
    daysPassed,
    remainingDays,
    dailyLimit,
    percentageSpent,
    isOverspendingEarly,
    currentCycleExpenses,
  };
}
