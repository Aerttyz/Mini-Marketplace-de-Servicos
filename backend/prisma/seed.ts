import { Client } from '@elastic/elasticsearch';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

async function indexService(service: any) {
    return esClient.index({
        index: 'services',
        document: {
            id: service.id,
            name: service.name,
            description: service.description,
            categoryId: service.category_id,
        },
    });
}

async function main() {

    const categories = [
        'Diarista',
        'Pintor',
        'Eletricista',
        'Manicure',
        'Encanador',
        'Jardineiro',
        'Mecânico',
        'Cabelereiro'
    ];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    const passwordHash = await bcrypt.hash('12345678', 10);

    await prisma.user.upsert({
        where: { email: 'maria@gmail.com' },
        update: {},
        create: {
            username: 'Maria Cliente',
            email: 'maria@gmail.com',
            password: passwordHash,
            role: 'CLIENT',
        },
    });

    await prisma.user.upsert({
        where: { email: 'joao@gmail.com' },
        update: {},
        create: {
            username: 'João Cliente',
            email: 'joao@gmail.com',
            password: passwordHash,
            role: 'CLIENT',
        },
    });

    const anaUser = await prisma.user.upsert({
        where: { email: 'ana@gmail.com' },
        update: {},
        create: {
            username: 'Ana Silva Nails',
            email: 'ana@gmail.com',
            password: passwordHash,
            role: 'PROVIDER',
            provider: {
                create: {
                    city: 'São Paulo',
                    description: 'Especialista em unhas de gel e nail art com 5 anos de experiência.',
                }
            }
        },
        include: { provider: true }
    });

    const catManicure = await prisma.category.findUnique({ where: { name: 'Manicure' } });

    if (anaUser.provider && catManicure) {
        const service = await prisma.service.create({
            data: {
                name: 'Manicure e Pedicure Spa',
                description: 'Tratamento completo para suas mãos e pés, incluindo esfoliação, hidratação e cutilagem perfeita.',
                provider_id: anaUser.provider.id,
                category_id: catManicure.id,
                photos: [
                    'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'
                ],
                variations: {
                    create: [
                        { name: 'Mão Simples', price: 35.00, duration_minutes: 40 },
                        { name: 'Pé Simples', price: 40.00, duration_minutes: 40 },
                        { name: 'Pé e Mão (Combo)', price: 70.00, duration_minutes: 90 },
                        { name: 'Aplicação de Gel', price: 120.00, duration_minutes: 120 },
                    ]
                }
            }
        });
        await indexService(service);
    }

    const carlosUser = await prisma.user.upsert({
        where: { email: 'carlos@gmail.com' },
        update: {},
        create: {
            username: 'Carlos Pinturas',
            email: 'carlos@gmail.com',
            password: passwordHash,
            role: 'PROVIDER',
            provider: {
                create: {
                    city: 'Rio de Janeiro',
                    description: 'Pintura residencial e comercial. Acabamento fino e limpeza garantida.',
                }
            }
        },
        include: { provider: true }
    });

    const catPintor = await prisma.category.findUnique({ where: { name: 'Pintor' } });

    if (carlosUser.provider && catPintor) {
        const service = await prisma.service.create({
            data: {
                name: 'Pintura de Interiores',
                description: 'Renove sua casa com uma pintura profissional. Utilizamos as melhores tintas do mercado.',
                provider_id: carlosUser.provider.id,
                category_id: catPintor.id,
                photos: [
                    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80'
                ],
                variations: {
                    create: [
                        { name: 'Pintura por M²', price: 25.00, duration_minutes: 60 },
                        { name: 'Diária de Pintura', price: 250.00, duration_minutes: 480 },
                        { name: 'Pintura de Teto (Cômodo)', price: 150.00, duration_minutes: 180 },
                    ]
                }
            }
        });
        await indexService(service);
    }

    const robertoUser = await prisma.user.upsert({
        where: { email: 'roberto@gmail.com' },
        update: {},
        create: {
            username: 'Roberto Jardineiro',
            email: 'roberto@gmail.com',
            password: passwordHash,
            role: 'PROVIDER',
            provider: {
                create: {
                    city: 'Curitiba',
                    description: 'Paisagismo e manutenção de jardins. Deixe seu verde mais vivo!',
                }
            }
        },
        include: { provider: true }
    });

    const catJardineiro = await prisma.category.findUnique({ where: { name: 'Jardineiro' } });

    if (robertoUser.provider && catJardineiro) {
        const service = await prisma.service.create({
            data: {
                name: 'Manutenção de Jardim',
                description: 'Corte de grama, poda de árvores e adubação.',
                provider_id: robertoUser.provider.id,
                category_id: catJardineiro.id,
                photos: [
                    'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1611735341450-74d61e66ee69?auto=format&fit=crop&w=800&q=80'
                ],
                variations: {
                    create: [
                        { name: 'Corte de Grama (Pequeno)', price: 80.00, duration_minutes: 60 },
                        { name: 'Manutenção Completa', price: 200.00, duration_minutes: 240 },
                        { name: 'Poda de Árvore', price: 120.00, duration_minutes: 90 },
                    ]
                }
            }
        });
        await indexService(service);
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });