import {QueryRelevance} from './query-relevance.value';

export class QueryAdvanced {
  constructor(
    public searchText?: string,
    public queryRelevanceList?: QueryRelevance[]
  ) { this.queryRelevanceList = []; }
}
