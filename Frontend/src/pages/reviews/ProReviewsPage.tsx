import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

import ContainerMax from '../../components/common/ContainerMax';
import Section from '../../components/common/Section';
import { useLanguage } from '../../i18n/LanguageContext';
import { getUser } from '../../auth/auth';
import paths from '../../routes/paths';
import { MOCK_USER } from '../../mock_data/users';
import { useProService, type Pro } from '../../mock_data/pros';
import {
  deleteMyReview,
  getAllReviewsForPro,
  getMyReview,
  getProAggregate,
  getReviewsTick,
  subscribeToReviews,
  upsertMyReview,
  type DisplayReview,
  type UserReviewEntry,
} from '../../mock_data/reviewsStore';

type SortOption = 'recent' | 'highest' | 'lowest';

type FeedbackMsg = { severity: 'success' | 'info' | 'error'; text: string } | null;

type WriteReviewFormProps = {
  initialRating: number | null;
  initialText: string;
  isUpdate: boolean;
  feedback: FeedbackMsg;
  onSubmit: (rating: number | null, text: string) => void;
  onDelete?: () => void;
  scrollTargetRef: React.RefObject<HTMLDivElement | null>;
};

function WriteReviewForm({
  initialRating,
  initialText,
  isUpdate,
  feedback,
  onSubmit,
  onDelete,
  scrollTargetRef,
}: WriteReviewFormProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState<number | null>(initialRating);
  const [text, setText] = useState(initialText);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }} ref={scrollTargetRef}>
      <CardContent>
        <Typography sx={{ fontWeight: 800 }}>
          {isUpdate ? t('editYourReview') : t('writeReview')}
        </Typography>
        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1.5}>
          {feedback && <Alert severity={feedback.severity}>{feedback.text}</Alert>}

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography sx={{ fontWeight: 650 }}>{t('yourRating')}</Typography>
            <Rating value={rating} onChange={(_, v) => setRating(v)} size="large" />
          </Stack>

          <TextField
            label={t('yourReview')}
            placeholder={t('reviewPlaceholder')}
            multiline
            minRows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => onSubmit(rating, text)}>
              {isUpdate ? t('updateReview') : t('publishReview')}
            </Button>
            {isUpdate && onDelete && (
              <Button variant="outlined" color="error" onClick={onDelete}>
                {t('deleteReview')}
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ProReviewsPage() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const { id = '' } = useParams<{ id: string }>();

  const user = getUser();

  const { getById } = useProService();
  const [pro, setPro] = useState<Pro | null>(null);

  useEffect(() => {
    let cancelled = false;
    getById(id)
      .then((data) => {
        if (!cancelled) setPro(data);
      })
      .catch(() => {
        if (!cancelled) setPro(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id, getById]);

  useSyncExternalStore(subscribeToReviews, getReviewsTick, getReviewsTick);

  const baseReviews = useMemo(() => pro?.reviews ?? [], [pro]);

  const allReviews: DisplayReview[] = useMemo(
    () => getAllReviewsForPro(id, baseReviews),
    [id, baseReviews]
  );
  const aggregate = useMemo(
    () => getProAggregate(id, baseReviews),
    [id, baseReviews]
  );
  const myReview: UserReviewEntry | null = useMemo(
    () => (user ? getMyReview(id, user.email) : null),
    [id, user]
  );

  const [feedback, setFeedback] = useState<FeedbackMsg>(null);
  const [sort, setSort] = useState<SortOption>('recent');

  const formRef = useRef<HTMLDivElement | null>(null);

  const authorName = useMemo(() => {
    if (!user) return '';
    if (user.email.toLowerCase() === MOCK_USER.email.toLowerCase()) return MOCK_USER.fullName;
    const local = user.email.split('@')[0] ?? user.email;
    return local.charAt(0).toUpperCase() + local.slice(1);
  }, [user]);

  const breakdown = useMemo(() => {
    const buckets: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach((r) => {
      const b = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      buckets[b] += 1;
    });
    return buckets;
  }, [allReviews]);

  const sortedReviews = useMemo<DisplayReview[]>(() => {
    const list = [...allReviews];
    if (sort === 'highest') list.sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date));
    else if (sort === 'lowest') list.sort((a, b) => a.rating - b.rating || b.date.localeCompare(a.date));
    else list.sort((a, b) => b.date.localeCompare(a.date));

    if (user) {
      const email = user.email.toLowerCase();
      const mineIdx = list.findIndex((r) => r.ownedByEmail === email);
      if (mineIdx > -1) {
        const [mine] = list.splice(mineIdx, 1);
        list.unshift(mine);
      }
    }
    return list;
  }, [allReviews, sort, user]);

  if (!pro) {
    return (
      <Section sx={{ py: { xs: 4, md: 6 } }}>
        <ContainerMax>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 750 }}>{t('proNotFound')}</Typography>
              <Button sx={{ mt: 1.5 }} variant="outlined" onClick={() => nav(paths.findAPro)}>
                {t('backToPro')}
              </Button>
            </CardContent>
          </Card>
        </ContainerMax>
      </Section>
    );
  }

  const initial = pro.name.trim()[0]?.toUpperCase() ?? '?';

  const handleSubmit = (rating: number | null, text: string) => {
    if (!user) {
      nav(paths.login, { replace: true, state: { from: `/pros/${pro.id}/reviews` } });
      return;
    }
    if (!rating || rating < 1) {
      setFeedback({ severity: 'error', text: t('ratingRequired') });
      return;
    }
    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setFeedback({ severity: 'error', text: t('reviewTooShort') });
      return;
    }
    const wasUpdate = !!myReview;
    upsertMyReview(pro.id, user.email, { rating, text: trimmed, author: authorName });
    setFeedback({
      severity: 'success',
      text: wasUpdate ? t('reviewUpdated') : t('reviewPublished'),
    });
  };

  const handleDelete = () => {
    if (!user) return;
    deleteMyReview(pro.id, user.email);
    setFeedback({ severity: 'info', text: t('reviewDeleted') });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const basedOn = t('basedOnReviews').replace('{count}', String(aggregate.count));

  const formKey = myReview ? `mine-${myReview.date}-${myReview.rating}` : 'new';

  return (
    <Section sx={{ py: { xs: 4, md: 6 } }}>
      <ContainerMax>
        <Stack spacing={2.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              variant="text"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => nav(paths.findAPro)}
            >
              {t('backToPro')}
            </Button>
          </Stack>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ sm: 'center' }}
              >
                <Avatar sx={{ width: 64, height: 64 }}>{initial}</Avatar>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 850, fontSize: 22 }} noWrap>
                    {pro.name}
                  </Typography>
                  <Typography color="text.secondary" noWrap>
                    {pro.trade} • {pro.city} • {pro.age} {t('years')}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 0.75, flexWrap: 'wrap' }}
                  >
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <StarRoundedIcon fontSize="small" />
                          <span>
                            {aggregate.rating.toFixed(1)} ({aggregate.count})
                          </span>
                        </Stack>
                      }
                    />
                    <Chip size="small" variant="outlined" label={`${pro.hourlyFrom}€/h`} />
                    {pro.tags.slice(0, 3).map((tag) => (
                      <Chip key={tag} size="small" variant="outlined" label={tag} />
                    ))}
                  </Stack>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                  {t('reviewsPageTitle')}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('reviewsPageSubtitle')}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 800 }}>{t('averageRating')}</Typography>
                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ fontWeight: 900, fontSize: 40, lineHeight: 1 }}>
                    {aggregate.rating.toFixed(1)}
                  </Typography>
                  <Box>
                    <Rating value={aggregate.rating} precision={0.1} readOnly />
                    <Typography color="text.secondary" variant="body2" sx={{ mt: 0.25 }}>
                      {basedOn}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 800 }}>{t('ratingBreakdown')}</Typography>
                <Divider sx={{ my: 1.5 }} />

                <Stack spacing={0.75}>
                  {([5, 4, 3, 2, 1] as const).map((star) => {
                    const count = breakdown[star];
                    const total = aggregate.count || 1;
                    const pct = (count / total) * 100;
                    return (
                      <Stack key={star} direction="row" spacing={1.25} alignItems="center">
                        <Stack
                          direction="row"
                          spacing={0.25}
                          alignItems="center"
                          sx={{ minWidth: 44 }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {star}
                          </Typography>
                          <StarRoundedIcon fontSize="small" />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={aggregate.count ? pct : 0}
                          sx={{ flex: 1, height: 8, borderRadius: 999 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ minWidth: 32, textAlign: 'right' }}
                        >
                          {count}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {!user ? (
            <Card variant="outlined" sx={{ borderRadius: 3 }} ref={formRef}>
              <CardContent>
                <Typography sx={{ fontWeight: 800 }}>{t('writeReview')}</Typography>
                <Divider sx={{ my: 1.5 }} />
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                  <Typography color="text.secondary">{t('loginToReview')}</Typography>
                  <Button
                    variant="contained"
                    onClick={() =>
                      nav(paths.login, {
                        replace: true,
                        state: { from: `/pros/${pro.id}/reviews` },
                      })
                    }
                  >
                    {t('signIn')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <WriteReviewForm
              key={formKey}
              initialRating={myReview?.rating ?? null}
              initialText={myReview?.text ?? ''}
              isUpdate={!!myReview}
              feedback={feedback}
              onSubmit={handleSubmit}
              onDelete={myReview ? handleDelete : undefined}
              scrollTargetRef={formRef}
            />
          )}

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
              >
                <Typography sx={{ fontWeight: 800 }}>
                  {t('allReviewsCount')} ({aggregate.count})
                </Typography>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>{t('sort')}</InputLabel>
                  <Select
                    value={sort}
                    label={t('sort')}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                  >
                    <MenuItem value="recent">{t('sortMostRecent')}</MenuItem>
                    <MenuItem value="highest">{t('sortHighest')}</MenuItem>
                    <MenuItem value="lowest">{t('sortLowest')}</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              {sortedReviews.length === 0 ? (
                <Typography color="text.secondary">{t('noReviewsYet')}</Typography>
              ) : (
                <Stack spacing={1.25}>
                  {sortedReviews.map((r) => {
                    const isMine = !!user && r.ownedByEmail === user.email.toLowerCase();
                    return (
                      <Card key={r.id} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ py: 1.5 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="baseline"
                            sx={{ flexWrap: 'wrap', gap: 1 }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography sx={{ fontWeight: 750 }}>{r.author}</Typography>
                              {isMine && (
                                <Chip
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  label={t('yourReviewTag')}
                                />
                              )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {r.date}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            sx={{ mt: 0.5 }}
                          >
                            <Rating value={r.rating} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {r.rating.toFixed(1)}
                            </Typography>
                          </Stack>

                          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                            {r.text}
                          </Typography>

                          {isMine && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Button size="small" variant="outlined" onClick={scrollToForm}>
                                {t('editYourReview')}
                              </Button>
                              <Button
                                size="small"
                                variant="text"
                                color="error"
                                onClick={handleDelete}
                              >
                                {t('deleteReview')}
                              </Button>
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </ContainerMax>
    </Section>
  );
}
