export interface CreateDealSuccessStoryDto {
  title: string;
  description: string;
  tradeDealId: string;
  totalValue: number;
  totalInvested: number;
  commodity: string;
  impactScore: number;
}