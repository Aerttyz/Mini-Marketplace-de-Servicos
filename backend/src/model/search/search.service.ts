import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ServiceDocument } from './interfaces/document-interface';

@Injectable()
export class SearchService {
    constructor(private readonly esService: ElasticsearchService) { }

    async indexService(service: any) {
        return this.esService.index({
            index: 'services',
            document: {
                id: service.id,
                name: service.name,
                description: service.description,
                categoryId: service.category_id,
            },
        });
    }

    async searchServices(text: string) {
        const response = await this.esService.search<ServiceDocument>({
            index: 'services',
            query: {
                multi_match: {
                    query: text,
                    fields: ['name', 'description'],
                    fuzziness: 'AUTO',
                },
            },
        });
        return response.hits.hits
            .map((hit) => hit._source?.id)
            .filter((id) => id != null) as Array<string | number>;
    }
}