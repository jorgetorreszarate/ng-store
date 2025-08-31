import { DOCUMENT } from '@angular/common';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';

let totalRequests = 0;

export function loadingInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
  const document = inject(DOCUMENT);

  totalRequests++;
  let context: NodeListOf<any>;
  const ctx = request.headers.get('context');
  if (ctx) {
    context = document.querySelectorAll(ctx);

    if (context.length) {
      const message = request.headers.get('caption') || 'Procesando...';
      context.forEach(el => {
        el.setAttribute('loading', message);
        el.classList.add('loading');
      });
    }
  }

  return next(request).pipe(
    finalize(() => decreaseRequests(context))
  );
}

function decreaseRequests(context: any) {
  totalRequests = Math.max(totalRequests, 1) - 1;

  if (totalRequests === 0) {
    // all the http services
  }

  context?.forEach(el => {
    el.classList.remove('loading');
  });
}
