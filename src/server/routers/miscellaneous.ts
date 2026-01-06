import { Properties } from "@/models/property";
import { publicProcedure, router } from "../trpc";

export const miscellaneousRouter = router({
  toggle: publicProcedure.query(async()=>{

    const pipeline = [
      {
        $match:{
          // Your match criteria here
          rentalType: /short term/i
        }
      },
      {
        $group: {
          _id: "$rentalType",
          count: { $sum: 1 }
        }
      }
    ]
    const properties = await Properties.find({

    })
  })
})