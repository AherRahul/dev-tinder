const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",                    // reference to the user table
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",                    // reference to the user table
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "intrested", "accepted", "rejected"],
            message: "{VALUE} is not supported"
        }
    }
}, { timestamps: true });

// compound index for optimization
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error ("Invalid request sent(cricular condition)" );
    }

    next();
});


const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;