import mongoose from "mongoose";

const schema = new mongoose.Schema({
    history_id:{
      type : mongoose.Schema.Types.ObjectId,
      ref : "StudentHistory",
      required : true,
    },
    suggestions : {
      type : [String],
      required : true,
    }
});

const Suggestions = mongoose.model("Suggestions", schema);

export default Suggestions