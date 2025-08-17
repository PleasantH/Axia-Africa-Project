import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    category: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: function(v: number) {
                return v > 0;
            },
            message: 'Price must be greater than 0'
        }
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
        enum: {
            values: ['fiction', 'non-fiction'],
            message: '{VALUE} is not a valid category'
        }
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        validate: {
            validator: function(v: number) {
                return Number.isInteger(v);
            },
            message: 'Quantity must be a whole number'
        }
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' }); // Text search index

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
    return `${this.price.toFixed(2)}`;
});

// Virtual for stock status
productSchema.virtual('inStock').get(function() {
    return this.quantity > 0;
});

// Pre-save middleware
productSchema.pre('save', function(next) {
    if (this.name) {
        this.name = this.name.trim();
    }
    if (this.category) {
        this.category = this.category.toLowerCase();
    }
    next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);