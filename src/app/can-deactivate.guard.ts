import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
  gotoSheetButtonDisable: boolean;
  dataNotSaveAlert: () => Promise<boolean>; // Updated to return a Promise
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  // If gotoSheetButtonDisable is false, show the alert
  if (!component.gotoSheetButtonDisable) {
    return component.dataNotSaveAlert().then((result) => {
      // If user confirmed, allow navigation
      return result;
    });
  }

  // If gotoSheetButtonDisable is true, allow navigation by default
  return true;
};
