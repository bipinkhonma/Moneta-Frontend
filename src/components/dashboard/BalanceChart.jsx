import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosClient from "../../api/axiosClient";

function BalanceChart({ accounts }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessTransactions = async () => {
      try {
        // Fetch transactions for all accounts
        const transactionsByDate = {};

        for (const account of accounts) {
          try {
            const res = await axiosClient.get(`/accounts/${account.account_id}/transactions`);
            const transactions = res.data.transactions || [];

            // Process transactions and build running balance
            let runningBalance = Number(account.balance);

            // Sort transactions by date (newest first from API, so we reverse)
            const sortedTxns = [...transactions].sort((a, b) => 
              new Date(a.created_at) - new Date(b.created_at)
            );

            sortedTxns.forEach((txn) => {
              const date = new Date(txn.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              if (!transactionsByDate[date]) {
                transactionsByDate[date] = 0;
              }
              transactionsByDate[date] += Number(txn.amount);
            });
          } catch (err) {
            console.log(`Could not fetch transactions for account ${account.account_id}`);
          }
        }

        // Build chart data with cumulative running balance
        const totalStartBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
        const sortedDates = Object.keys(transactionsByDate).sort((a, b) => 
          new Date(a) - new Date(b)
        );

        let cumulativeBalance = totalStartBalance;
        const data = sortedDates.map((date) => {
          cumulativeBalance -= transactionsByDate[date];
          return {
            date,
            balance: parseFloat(cumulativeBalance.toFixed(2)),
          };
        });

        // Add today's balance at the end
        const today = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (data.length === 0 || data[data.length - 1].date !== today) {
          data.push({
            date: today,
            balance: totalStartBalance,
          });
        }

        setChartData(data);
      } catch (err) {
        console.error("Error processing transactions for chart:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchAndProcessTransactions();
    } else {
      setLoading(false);
    }
  }, [accounts]);

  if (loading) {
    return <div className="surface loading-panel">Loading balance trend...</div>;
  }

  if (chartData.length === 0) {
    return null; // No data to display
  }

  return (
    <div className="surface" style={{ padding: "24px", marginBottom: "24px" }}>
      <div style={{ marginBottom: "16px" }}>
        <span className="eyebrow">Trends</span>
        <h3 style={{ margin: "5px 0 0", color: "var(--ink)", fontSize: "18px", fontWeight: "600" }}>
          Balance over time
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--muted)" style={{ fontSize: "12px" }} />
          <YAxis stroke="var(--muted)" style={{ fontSize: "12px" }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#fff", 
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "10px"
            }}
            formatter={(value) => `NPR ${value.toFixed(2)}`}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="var(--copper)" 
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BalanceChart;
