import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AllServices } from "@ioc:forfabledomain"

export type ServiceHandler<T> = () => (handler?: HttpContextContract) => T

type Services = {[key in keyof AllServices]: ServiceHandler<AllServices[key]>}

export default Services