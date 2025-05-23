import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
})

const restauranteSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    restauranteName: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    deliveryPrice: { type: String, required: true },
    estimatedDeliveryTime: { type: String, required: true },
    cuisines: [{type: String, required: true}],
    menuItems: [menuItemSchema],
    imageUrl: { type: String, required: true },
    lastUpdated: {type: Date, required:true},
})

export default mongoose.model("Restaurante", restauranteSchema);