import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionsService {
    constructor(
        @InjectRepository(Promotion)
        private promoRepo: Repository<Promotion>,
    ) { }

    findAll() {
        return this.promoRepo.find({ order: { expiresAt: 'ASC' } });
    }

    create(data: Partial<Promotion>) {
        const promo = this.promoRepo.create(data);
        return this.promoRepo.save(promo);
    }

    update(id: number, data: Partial<Promotion>) {
        return this.promoRepo.update(id, data);
    }

    async delete(id: number) {
        const promo = await this.promoRepo.findOneBy({ id });
        if (!promo) throw new NotFoundException('Cupón no encontrado');
        return this.promoRepo.remove(promo);
    }

    async validarCodigo(code: string) {
        const promo = await this.promoRepo.findOneBy({ code });
        if (!promo || !promo.active || new Date(promo.expiresAt) < new Date()) {
            return { valido: false };
        }
        return {
            valido: true,
            descuento: promo.discount,
            descripcion: promo.description,
        };
    }
}
