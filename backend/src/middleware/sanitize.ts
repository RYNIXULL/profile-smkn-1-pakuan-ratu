import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

export function sanitizeHtmlContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
      '*': ['class', 'style'],
    },
    allowedSchemes: ['http', 'https'],
  });
}

export function sanitizeNewsContent(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body.content === 'string') {
    req.body.content = sanitizeHtmlContent(req.body.content);
  }
  next();
}

export function sanitizePageContent(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) {
    if (typeof req.body.content === 'string') {
      req.body.content = sanitizeHtmlContent(req.body.content);
    }
    if (typeof req.body.description === 'string') {
      req.body.description = sanitizeHtmlContent(req.body.description);
    }
  }
  next();
}

