import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

interface WorkExperience {
    company: string;
    role: string;
    startDate: Date;
    endDate: Date;
    description: string;
}

interface JobApplication {
    jobTitle: string;
    company: string;
    status: "applied" | "interview" | "offer" | "rejected";
}

interface result {
    id: number;
    question: string;
    assessment: string;
}

export interface User {
    username: string;
    fullname: string;
    email: string;
    password: string;
    age?: number;
    education?: string;  
    skills?: string;
    interests?: string; 
    workExperience?: WorkExperience[];
    ambitions?: string;  
    aptitudeQuestions: result[],
    skillQuestions: result[],
    aptitudeEvaluation?: string[];
    skillEvaluation?: string[];
    aptitudeScores?: Record<string, number>;  
    resumeUrl?: string;  
    careerPathRecommendations?: string[];
    jobApplications?: JobApplication[];  
    isPasswordCorrect(para1: string) :Promise<boolean>;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}


const WorkExperienceSchema: Schema<WorkExperience> = new Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String }
});

// JobApplication sub-schema
const resultSchema: Schema<result> = new Schema({
    id: {type: Number,  required: true},
    question: { type: String, required: true },
    assessment: { type: String, required: true },
});

const JobApplicationSchema: Schema<JobApplication> = new Schema({
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    status: {
        type: String,
        enum: ["applied", "interview", "offer", "rejected"],
        required: true
    }
});

// Main User schema
const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: true},
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    education: { type: String }, 
    skills: { type: String },  
    interests: { type: String }, 
    workExperience: { type: [WorkExperienceSchema], default: [] },
    ambitions: { type: String },  
    aptitudeQuestions: {type: [resultSchema], default:[]},
    skillQuestions: {type: [resultSchema], default:[]},
    aptitudeEvaluation: { type: [String], default: [] },
    skillEvaluation: { type: [String], default: [] },
    aptitudeScores: { type: Map, of: Number }, 
    resumeUrl: { type: String },
    careerPathRecommendations: { type: [String], default: [] },  
    jobApplications: { type: [JobApplicationSchema], default: [] }, 
    refreshToken : { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next){
   if(!this.isModified('password')) return next();

   this.password = await bcrypt.hash(this.password, 10);
   next();
})

UserSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
   return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = function():string{
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function(): string{
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

// Creating a Mongoose model for User
const UserModel =(mongoose.models.User as mongoose.Model<User>) || (mongoose.model('User', UserSchema));

export default UserModel