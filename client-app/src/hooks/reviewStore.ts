import { create } from "zustand";
import agent from "../app/api/agent";
import { Review } from "../app/types/review";

type State = {
    loadingInital: boolean;
    loadingButton: boolean;
    loading: boolean;
    reviews: Review[];
}

type Actions = {
    loadReviews: () => Promise<void>
}

const useReviewStore = create<State & Actions>((set,get)=>({
    loadingInital: false,
    loadingButton:false,
    loading: false,
    reviews: [],
    loadReviews: async () => {
        try {
            set({loadingInital: true});
            const reviews = await agent.Reviews.get();
            if (reviews.length > get().reviews.length) {
                set({reviews: reviews});
            }
        } catch (error) {
            throw(error);
        } finally {
            set({loadingInital: false});
        }
    }
}));

export default useReviewStore;