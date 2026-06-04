import express from 'express'
import { prisma, Prisma } from '@repo/database';

const app = express();
app.use(express.json())

 app.post('/hdfcWebhook',async (req,res)=>{
    const paymentInformation = {
        token:req.body.token,
        userId:Number(req.body.user_identifier),
        amount:Number(req.body.amount)
    }
    try {
        await prisma.$transaction([
    
             prisma.balances.update({
                where:{
                    userId:paymentInformation.userId
                },
                data:{
                    amount:{
                        increment:paymentInformation.amount
                    }
                }
            }),
             prisma.onRampTransaction.update({
                where:{
                    token:paymentInformation.token,
                },
                data:{
                    status:'Success'
                }
            })
        ])
    } catch (error) {
        console.log(error)
        return res.status(411).json({
            message:"error while processing"
        })
    }

    return res.status(200).json({
        message:"captured"
    })
})