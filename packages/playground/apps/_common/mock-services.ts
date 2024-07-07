import type { EditorHost } from '@blocksuite/block-std';
import type { PageRootService } from '@blocksuite/blocks';
import {
  type NotificationService,
  type QuickSearchService,
  toast,
} from '@blocksuite/blocks';
import type { DocCollection } from '@blocksuite/store';

export function mockNotificationService(service: PageRootService) {
  const notificationService: NotificationService = {
    toast: (message, options) => {
      toast(service.host as EditorHost, message, options?.duration);
    },
    confirm: notification => {
      return Promise.resolve(confirm(notification.title.toString()));
    },
    prompt: notification => {
      return Promise.resolve(
        prompt(notification.title.toString(), notification.autofill?.toString())
      );
    },
    notify: notification => {
      // todo: implement in playground
      console.log(notification);
    },
  };
  return notificationService;
}

export function mockQuickSearchService(collection: DocCollection) {
  const quickSearchService: QuickSearchService = {
    async searchDoc({ userInput }) {
      if (!userInput) {
        return null;
      }
      if (URL.canParse(userInput)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const path = new URL(userInput).pathname;
        const item =
          path.length > 1
            ? [...collection.docs.values()].find(doc => {
                return doc.meta?.title === path.slice(1);
              })
            : null;
        if (item) {
          return {
            docId: item.id,
          };
        }
        return {
          userInput: userInput,
        };
      }
      const doc = [...collection.docs.values()].find(
        v => v.meta?.title === userInput
      );
      if (doc) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          docId: doc.id,
        };
      }
      return null;
    },
  };
  return quickSearchService;
}
