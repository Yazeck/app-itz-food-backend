import {Request, Response} from 'express';
import User from '../models/userModel';


export const createUser= async(req: Request, res: Response) :Promise<any>=> {
    //verificar si el usuario ya existe
    // crear usuario si no existe
    //regresar el objeto del usuario al cliente(frontend)
    try{
        const{auth0Id} = req.body;
        const existingUser = await User.findOne({auth0Id});
        if(existingUser){
            return res.status(200).json(existingUser.toObject());
        }
        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json(newUser.toObject());
    }catch(error){  
        console.log(error);
        res.status(500).json({message: "error al crear el usuario"});
    }
}

export const updateUser =async (req: Request, res:Response):Promise<any> => {
try {
    const {name, address, city,country} = req.body;
    const user =await User.findById(req.userId);
    if(!user){
        return res.status(404).json({message: "usuario no encontrado"});
    }
    user!.name = name;
    user!.address = address;
    user!.city = city;
    user!.country = country;

    await user!.save();
    res.status(200).json(user.toObject());


}catch(error){
    console.log(error);
   return res.status(500).json({message: "error al actualizar el usuario"});
}
}//fin de updateUser

export const getUser =async(req: Request, res:Response ): Promise<any>=>{
    try{
        const user = await User.findById(req.userId);

        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    
        return res.status(200).json(user.toObject());
    }
catch(error){
console.log(error);
res.status(500).json({message: 'error al obtener el usuario'})
}
}//fin de getUser