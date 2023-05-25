import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommunicationService {

    private _imageChange = new BehaviorSubject<boolean>(false);

    get imageChangeState(): any {
        return this._imageChange.asObservable();
    }

    public setImageChangeState(change: boolean): void {
        this._imageChange.next(change);
    }

}
