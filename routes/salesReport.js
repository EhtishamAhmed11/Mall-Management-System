import express from 'express';
const router = express.Router();
import Purchase from '../models/purchase.js';
import Sales from '../models/sale.js';
router.get('/salesReport', async (req, res) => {
  try {
    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: "$shop_id",
          totalPurchases: { $sum: "$amount" },
          totalItemsPurchases: {
            $sum: {
              $cond: {
                if: { $isArray: "$purchased_items" },
                then: { $size: "$purchased_items" },
                else: 0
              }
            }
          }
        }
      }
    ]);

    const sales = await Sales.aggregate([
      {
        $group: {
          _id: "$shop_id",
          totalSales: { $sum: "$price" },
          totalItemsSales: {
            $sum: {
              $cond: {
                if: { $isArray: "$item" },
                then: { $size: "$item" },
                else: 0
              }
            }
          }
        }
      }
    ]);

    const report = purchases.map(purchase => {
      const sale = sales.find(s => s._id.toString() === purchase._id.toString());
      return {
        shop_id: purchase._id,
        totalPurchases: purchase.totalPurchases,
        totalItemsPurchases:purchase ? purchase.totalItemsPurchases:0,
        totalSales: sale ? sale.totalSales : 0,
        totalItemsSales: sale ? sale.totalItemsSales : 0,
      };
    });

    res.status(200).json(report);
  } catch (err) {
    console.error("Error Generating Sales Report:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/salesReportByDate', async (req, res) => {
    const { start_date, end_date } = req.query;
  
    if (!start_date || !end_date) {
      return res.status(400).json({ error: "Please provide start and end date" });
    }
  
    try {
      const start = new Date(start_date); // Start of the day for start_date
      const end = new Date(end_date); // End of the day for end_date
  
      const purchases = await Purchase.aggregate([
        {
          $match: {
            created_at: {
              $gte: start,
              $lte: end,
            }
          }
        },
        {
          $group: {
            _id: "$shop_id",
            totalPurchases: { $sum: "$amount" },
            totalItemsPurchases: {
              $sum: {
                $cond: {
                  if: { $isArray: "$purchased_items" },
                  then: { $size: "$purchased_items" },
                  else: 0
                }
              }
            }
          }
        }
      ]);
  
      const sales = await Sales.aggregate([
        {
          $match: {
            created_at: {
              $gte: start,
              $lte: end,
            }
          }
        },
        {
          $group: {
            _id: "$shop_id",
            totalSales: { $sum: "$price" },
            totalItemsSales: {
              $sum: {
                $cond: {
                  if: { $isArray: "$item" },
                  then: { $size: "$item" },
                  else: 0
                }
              }
            }
          }
        }
      ]);
  
      const report = purchases.map(purchase => {
        const sale = sales.find(s => s._id.toString() === purchase._id.toString());
        return {
          shop_id: purchase._id,
          totalPurchases: purchase.totalPurchases,
          totalItemsPurchases: purchase.totalItemsPurchases,
          totalSales: sale ? sale.totalSales : 0,
          totalItemsSales: sale ? sale.totalItemsSales : 0,
        };
      });
  
      res.status(200).json(report);
    } catch (error) {
      console.error("Error generating sales report by date:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
export default router;
